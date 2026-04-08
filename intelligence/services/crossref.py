import requests
import os
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def search_papers(query, year_from=None, year_to=None, page=1, num=10, per_page=None, **kwargs):
    """Search for research papers using Crossref API"""
    try:
        if per_page is not None:
            num = per_page

        base_url = "https://api.crossref.org/works"
        params = {
            "query": query,
            "rows": num,
            "offset": (page - 1) * num,
            "select": "title,author,published-print,published-online,abstract,DOI"
        }
        
        # Add year filter if provided
        if year_from and year_to:
            params["filter"] = f"from-pub-date:{year_from},until-pub-date:{year_to}"
        elif year_from:
            params["filter"] = f"from-pub-date:{year_from}"
        
        headers = {
            "User-Agent": "TechSentry/1.0 (mailto:contact@techsentry.com)"
        }
        
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Transform Crossref data to our format
        papers = []
        for item in data.get("message", {}).get("items", []):
            # Handle title properly
            title_list = item.get("title", [])
            if isinstance(title_list, list):
                title = " ".join(title_list)
            else:
                title = str(title_list)
            
            # Handle publication year
            pub_year = None
            try:
                pub_print = item.get("published-print", {}).get("date-parts", [])
                pub_online = item.get("published-online", {}).get("date-parts", [])
                
                if pub_print and len(pub_print) > 0 and len(pub_print[0]) > 0:
                    pub_year = pub_print[0][0]
                elif pub_online and len(pub_online) > 0 and len(pub_online[0]) > 0:
                    pub_year = pub_online[0][0]
            except:
                pub_year = None
            
            paper = {
                "id": item.get("DOI", "").replace("/", "_") if item.get("DOI") else str(hash(title)),
                "title": title,
                "abstract": item.get("abstract", ""),
                "publication_year": pub_year,
                "authorships": [
                    {
                        "author": {
                            "display_name": " ".join([author.get("given", ""), author.get("family", "")]).strip()
                        }
                    } for author in item.get("author", []) if author.get("given") or author.get("family")
                ],
                "cited_by_count": item.get("is-referenced-by-count", 0),
                "primary_location": {
                    "landing_page_url": item.get("URL", "")
                }
            }
            papers.append(paper)
        
        return papers
        
    except Exception as e:
        print(f"Crossref API error: {e}")
        return []

def get_paper_details(paper_id):
    """Get detailed paper information using Crossref"""
    try:
        # Convert ID back to DOI format if needed
        if "_" in paper_id:
            doi = paper_id.replace("_", "/")
        else:
            doi = paper_id
        
        url = f"https://api.crossref.org/works/{doi}"
        headers = {
            "User-Agent": "TechSentry/1.0 (mailto:contact@techsentry.com)"
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        item = data.get("message", {})
        
        paper = {
            "id": paper_id,
            "title": " ".join(item.get("title", [])),
            "abstract": item.get("abstract", ""),
            "publication_year": item.get("published-print", {}).get("date-parts", [None])[0] or 
                          item.get("published-online", {}).get("date-parts", [None])[0],
            "authorships": [
                {
                    "author": {
                        "display_name": " ".join([author.get("given", ""), author.get("family", "")])
                    },
                    "institutions": author.get("affiliation", [])
                } for author in item.get("author", [])
            ],
            "cited_by_count": item.get("is-referenced-by-count", 0),
            "primary_location": {
                "landing_page_url": item.get("URL", "")
            },
            "references": item.get("reference", []),
            "concepts": []
        }
        
        return paper
        
    except Exception as e:
        print(f"Crossref paper details error: {e}")
        return None
