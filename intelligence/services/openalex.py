import requests
import os
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OPENALEX_BASE = "https://api.openalex.org"

def search_papers(query, year_from=None, year_to=None, page=1, num=10, per_page=None, **kwargs):
    """Search for research papers using Crossref API"""
    try:
        if per_page is not None:
            num = per_page

        base_url = "https://api.crossref.org/works"
        params = {
            "query": query,
            "filter": f"from-pub-date:{year_from}",
            "rows": num,
            "offset": (page - 1) * num,
            "select": "title,author,published-print,published-online,abstract,DOI"
        }
        
        headers = {
            "User-Agent": "TechSentry/1.0 (mailto:contact@techsentry.com)"
        }
        
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Transform Crossref data to our format
        papers = []
        for item in data.get("message", {}).get("items", []):
            paper = {
                "id": item.get("DOI", "").replace("/", "_"),
                "title": " ".join(item.get("title", [])),
                "abstract": item.get("abstract", ""),
                "publication_year": item.get("published-print", {}).get("date-parts", [None])[0] or 
                              item.get("published-online", {}).get("date-parts", [None])[0],
                "authorships": [
                    {
                        "author": {
                            "display_name": " ".join([author.get("given", ""), author.get("family", "")])
                        }
                    } for author in item.get("author", [])
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
        return {"success": True, "count": data.get("meta", {}).get("count", 0), "results": papers}
    except Exception as e:
        print(f"OpenAlex API Error: {e}")
        return {"success": False, "error": str(e), "results": []}

def get_papers_per_year(query):
    url = f"{OPENALEX_BASE}/works"
    results = {}
    for year in range(2000, 2027):
        params = {
            "filter": f"publication_year:{year},title.search:{query}",
            "mailto": os.getenv("OPENALEX_EMAIL", "research@techsentry.in"),
            "select": "id"
        }
        r = requests.get(url, params=params).json()
        results[year] = r.get("meta", {}).get("count", 0)
    return results

def get_paper_details(paper_id):
    url = f"{OPENALEX_BASE}/works/{paper_id}"
    params = {
        "mailto": os.getenv("OPENALEX_EMAIL", "research@techsentry.in"),
        "select": "id,title,publication_year,cited_by_count,authorships,primary_location,abstract_inverted_index,concepts,references"
    }
    response = requests.get(url, params=params)
    return response.json()

def get_top_papers(query, limit=20):
    url = f"{OPENALEX_BASE}/works"
    params = {
        "search": query,
        "filter": f"cited_by_count:>10",
        "sort": "cited_by_count:desc",
        "per-page": limit,
        "mailto": settings.OPENALEX_EMAIL,
        "select": "id,title,publication_year,cited_by_count,authorships,primary_location,abstract_inverted_index"
    }
    response = requests.get(url, params=params)
    return response.json()
