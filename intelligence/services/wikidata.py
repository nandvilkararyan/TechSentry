import requests
from django.conf import settings
import json

def search_companies(query, limit=5):
    sparql_query = f"""
    SELECT ?company ?companyLabel ?countryLabel ?industryLabel ?founded ?description WHERE {{
      ?company wdt:P31 wd:Q6881511;  # Instance of business enterprise
                rdfs:label ?companyLabel;
                wdt:P17 ?country;
                wdt:P452 ?industry;
                wdt:P571 ?founded.
      FILTER(LANG(?companyLabel) = "en")
      FILTER(LANG(?countryLabel) = "en")
      FILTER(LANG(?industryLabel) = "en")
      FILTER(CONTAINS(LCASE(?companyLabel), LCASE("{query}")))
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT {limit}
    """
    
    url = settings.WIKIDATA_SPARQL
    params = {
        "query": sparql_query,
        "format": "json"
    }
    response = requests.get(url, params=params)
    return response.json()

def get_company_details(company_name):
    # Escape the company name for SPARQL
    escaped_name = company_name.replace('"', '\\"')
    
    sparql_query = f"""
    SELECT ?company ?companyLabel ?countryLabel ?industryLabel ?founded ?employees ?revenue ?website WHERE {{
      ?company wdt:P31 wd:Q6881511;
                rdfs:label ?companyLabel;
                wdt:P17 ?country.
      OPTIONAL {{ ?company wdt:P452 ?industry. }}
      OPTIONAL {{ ?company wdt:P571 ?founded. }}
      OPTIONAL {{ ?company wdt:P1128 ?employees. }}
      OPTIONAL {{ ?company wdt:P2139 ?revenue. }}
      OPTIONAL {{ ?company wdt:P856 ?website. }}
      FILTER(LANG(?companyLabel) = "en")
      FILTER(?companyLabel = "{escaped_name}"@en)
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 1
    """
    
    url = settings.WIKIDATA_SPARQL
    params = {
        "query": sparql_query,
        "format": "json"
    }
    response = requests.get(url, params=params)
    return response.json()

def get_technology_companies(technology_query, limit=10):
    # Escape the query for SPARQL
    escaped_query = technology_query.replace('"', '\\"')
    
    sparql_query = f"""
    SELECT ?company ?companyLabel ?countryLabel ?industryLabel ?founded WHERE {{
      ?company wdt:P31 wd:Q6881511;
                rdfs:label ?companyLabel;
                wdt:P17 ?country;
                wdt:P452 ?industry;
                wdt:P571 ?founded.
      FILTER(LANG(?companyLabel) = "en")
      FILTER(CONTAINS(LCASE(?companyLabel), LCASE("{escaped_query}")) ||
              CONTAINS(LCASE(?industryLabel), LCASE("{escaped_query}")))
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT {limit}
    """
    
    url = settings.WIKIDATA_SPARQL
    params = {
        "query": sparql_query,
        "format": "json"
    }
    response = requests.get(url, params=params)
    return response.json()
