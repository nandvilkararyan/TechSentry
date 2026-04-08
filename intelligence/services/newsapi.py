import requests
import os
from datetime import datetime, timedelta
from django.conf import settings

def search_news(query, page_size=10):
    api_key = getattr(settings, 'NEWS_API_KEY', None)
    if not api_key:
        return {"success": False, "error": "NEWS_API_KEY not found", "results": []}
    
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "apiKey": api_key,
        "pageSize": page_size,
        "sortBy": "publishedAt",
        "language": "en"
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        articles = []
        for a in data.get("articles", []):
            articles.append({
                "title": a.get("title", ""),
                "source": a.get("source", {}).get("name", ""),
                "publishedAt": a.get("publishedAt", ""),
                "description": a.get("description", ""),
                "url": a.get("url", ""),
                "urlToImage": a.get("urlToImage", "")
            })
        return {"success": True, "results": articles}
    except Exception as e:
        print(f"NewsAPI Error: {e}")
        return {"success": False, "error": str(e), "results": []}

def get_news_volume(query, days=30):
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        return {"success": False, "error": "NEWS_API_KEY not found", "volume": {}}
    
    url = "https://newsapi.org/v2/everything"
    volume = {}
    
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        params = {
            "q": query,
            "apiKey": api_key,
            "from": date,
            "to": date,
            "pageSize": 100,
            "sortBy": "publishedAt"
        }
        try:
            r = requests.get(url, params=params, timeout=5)
            if r.status_code == 200:
                data = r.json()
                volume[date] = data.get("totalResults", 0)
            else:
                volume[date] = 0
        except:
            volume[date] = 0
    
    return {"success": True, "volume": volume}

def get_news_sentiment_analysis(query, limit=50):
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        return {"success": False, "error": "NEWS_API_KEY not found", "sentiment": {}}
    
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "apiKey": api_key,
        "pageSize": limit,
        "sortBy": "publishedAt"
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        # Simple sentiment analysis based on keywords
        positive_words = ["breakthrough", "success", "advancement", "achievement", "milestone"]
        negative_words = ["failure", "delay", "concern", "challenge", "setback"]
        
        sentiment = {"positive": 0, "negative": 0, "neutral": 0}
        
        for article in data.get("articles", []):
            text = (article.get("title", "") + " " + article.get("description", "")).lower()
            
            pos_count = sum(1 for word in positive_words if word in text)
            neg_count = sum(1 for word in negative_words if word in text)
            
            if pos_count > neg_count:
                sentiment["positive"] += 1
            elif neg_count > pos_count:
                sentiment["negative"] += 1
            else:
                sentiment["neutral"] += 1
        
        return {"success": True, "sentiment": sentiment}
    except Exception as e:
        print(f"NewsAPI Sentiment Error: {e}")
        return {"success": False, "error": str(e), "sentiment": {}}
    return sentiment_percentages
