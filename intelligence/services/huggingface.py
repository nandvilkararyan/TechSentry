import requests
import json
import os
from django.conf import settings

HF_API_KEY = getattr(settings, 'HUGGINGFACE_API_KEY', None) or os.getenv('HUGGINGFACE_API_KEY')
HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"} if HF_API_KEY else {}

def generate_summary(text):
    """Generate summary using Hugging Face API"""
    if not HF_API_KEY:
        return {
            'success': False,
            'error': 'Hugging Face API key not configured',
            'summary': f"This research discusses {text[:100]}... (Summary unavailable - API key not configured)"
        }
    
    try:
        # Try a different model that should be available
        API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6"
        payload = {"inputs": text[:1024]}  # Limit text length
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0 and 'summary_text' in result[0]:
                return {
                    'success': True,
                    'summary': result[0]['summary_text']
                }
            else:
                # Try fallback model
                return generate_summary_fallback(text)
        elif response.status_code == 410:
            # Model not found, try fallback
            return generate_summary_fallback(text)
        else:
            return {
                'success': False,
                'error': f'API request failed with status {response.status_code}',
                'summary': text[:200] + "..."  # Fallback to truncated text
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'summary': text[:200] + "..."  # Fallback to truncated text
        }

def generate_summary_fallback(text):
    """Fallback summary using a different model"""
    try:
        API_URL = "https://api-inference.huggingface.co/models/t5-small"
        payload = {"inputs": f"summarize: {text[:512]}"}  # T5 uses prefix
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0 and 'generated_text' in result[0]:
                return {
                    'success': True,
                    'summary': result[0]['generated_text']
                }
        
        # If all else fails, return a simple extractive summary
        sentences = text.split('.')
        if len(sentences) > 2:
            return {
                'success': True,
                'summary': '. '.join(sentences[:2]) + '.'
            }
        else:
            return {
                'success': True,
                'summary': text[:200] + "..."
            }
    except Exception as e:
        return {
            'success': False,
            'error': f'Fallback failed: {str(e)}',
            'summary': text[:200] + "..."
        }

def classify_trl_zeroshot(text):
    API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
    labels = [
        "basic research", "applied research", "proof of concept",
        "prototype development", "system demonstration",
        "operational deployment"
    ]
    payload = {"inputs": text, "parameters": {"candidate_labels": labels}}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()

def extract_technology_entities(text):
    API_URL = "https://api-inference.huggingface.co/models/dslim/bert-base-NER"
    payload = {"inputs": text[:500]}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()

def analyze_sentiment(text):
    API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
    payload = {"inputs": text[:500]}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()

def extract_technology_convergence(abstracts):
    combined_text = " ".join(abstracts[:5])[:1000]
    API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
    
    technology_labels = [
        "artificial intelligence", "machine learning", "quantum computing", 
        "robotics", "cybersecurity", "biotechnology", "nanotechnology",
        "materials science", "energy storage", "communications", "sensors",
        "autonomous systems", "hypersonics", "directed energy", "space technology"
    ]
    
    payload = {"inputs": combined_text, "parameters": {"candidate_labels": technology_labels}}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()
