import requests
import os
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def search_companies(query, page=1, num=10):
    """Search for companies using OpenCorporates API"""
    try:
        base_url = "https://api.opencorporates.com/v0.4/companies/search"
        params = {
            "q": query,
            "per_page": num,
            "page": page
        }
        
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENCORPORATES_API_KEY', '')}"
        }
        
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Transform OpenCorporates data to our format
        companies = []
        for item in data.get("results", {}).get("companies", []):
            company = {
                "id": item.get("company_number", ""),
                "companyLabel": {
                    "value": item.get("name", "")
                },
                "countryLabel": {
                    "value": item.get("jurisdiction_code", "")
                },
                "description": item.get("description", ""),
                "incorporation_date": item.get("incorporation_date", ""),
                "company_status": item.get("company_status", ""),
                "registered_address": item.get("registered_address", ""),
                "officers": item.get("officers", []),
                "current_status": item.get("current_status", {})
            }
            companies.append(company)
        
        return companies
        
    except Exception as e:
        print(f"OpenCorporates API error: {e}")
        return []

def get_company_details(company_id):
    """Get detailed company information using OpenCorporates"""
    try:
        url = f"https://api.opencorporates.com/v0.4/companies/{company_id}"
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENCORPORATES_API_KEY', '')}"
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        return response.json()
        
    except Exception as e:
        print(f"OpenCorporates company details error: {e}")
        return None
