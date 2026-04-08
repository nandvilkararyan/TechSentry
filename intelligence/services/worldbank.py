import requests
from django.conf import settings

def get_rd_investment_data():
    try:
        url = f"{getattr(settings, 'WORLDBANK_BASE', 'https://api.worldbank.org/v2')}/country/all/indicator/GB.XPD.RSDV.GD.ZS"
        params = {
            "format": "json",
            "per_page": 300,
            "date": "2020:2023"
        }
        response = requests.get(url, params=params)
        return response.json()
    except Exception as e:
        print(f"World Bank API error: {e}")
        return None

def get_country_rd_spending(country_code="all", year=2022):
    try:
        url = f"{getattr(settings, 'WORLDBANK_BASE', 'https://api.worldbank.org/v2')}/country/{country_code}/indicator/GB.XPD.RSDV.GD.ZS"
        params = {
            "format": "json",
            "date": str(year)
        }
        response = requests.get(url, params=params)
        return response.json()
    except Exception as e:
        print(f"World Bank country data error: {e}")
        return None

def get_top_rd_countries(limit=10, technology=""):
    try:
        data = get_rd_investment_data()
        
        if not data or len(data) < 2:
            return {
                "success": False,
                "countries": [],
                "error": "World Bank API returned no data"
            }
        
        countries_data = {}
        for item in data[1]:
            if item.get('value') is not None and item.get('country', {}).get('value'):
                country_name = item['country']['value']
                if country_name not in countries_data:
                    countries_data[country_name] = []
                countries_data[country_name].append(item['value'])
        
        # Calculate average and sort
        avg_spending = []
        for country, values in countries_data.items():
            if values:
                avg = sum(values) / len(values)
                avg_spending.append({"name": country, "spending": avg})
        
        avg_spending.sort(key=lambda x: x["spending"], reverse=True)
        
        return {
            "success": True,
            "countries": avg_spending[:limit]
        }
    except Exception as e:
        print(f"Top R&D countries error: {e}")
        return {
            "success": False,
            "countries": [],
            "error": str(e)
        }

def get_rd_trend(country_code="USA", years=10):
    end_year = 2022
    start_year = end_year - years + 1
    
    url = f"{settings.WORLDBANK_BASE}/country/{country_code}/indicator/GB.XPD.RSDV.GD.ZS"
    params = {
        "format": "json",
        "date": f"{start_year}:{end_year}"
    }
    response = requests.get(url, params=params)
    return response.json()
