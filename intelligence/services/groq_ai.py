from groq import Groq
import os
import json
from django.conf import settings

def get_client():
    api_key = getattr(settings, 'GROQ_API_KEY', None)
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in Django settings")
    return Groq(api_key=api_key)

def chat_response(messages: list):
    client = get_client()
    system_prompt = """You are TechSentry AI, a senior defence technology intelligence analyst.

Your mission:
- Provide high-quality, practical analysis for defence R&D, technology scouting, and capability planning.
- Explain complex topics clearly without oversimplifying key uncertainty.

Response style requirements:
- Start with a direct answer in 1-2 lines.
- Then provide structured sections using markdown headings.
- Use concise bullets for findings, risks, and recommendations.
- Include explicit assumptions when data is uncertain.
- When useful, include TRL context, timeline bands (near/mid/long term), and measurable indicators.

Quality rules:
- Do not give vague generic advice; make recommendations actionable.
- Prefer specific checks, metrics, and decision criteria.
- If user query is broad, give a focused answer and then ask 1 clarifying question at the end.
- Keep tone professional, confident, and analyst-like.
"""
    groq_messages = [{"role": "system", "content": system_prompt}] + messages
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=groq_messages,
            max_tokens=1024,
            temperature=0.45
        )
        return {"success": True, "response": response.choices[0].message.content}
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {"success": False, "error": str(e)}

def generate_trl_assessment(abstracts: list, technology: str):
    client = get_client()
    combined = "\n\n".join(abstracts[:8])
    prompt = f"""Analyze these research paper abstracts about "{technology}" and estimate the Technology Readiness Level (TRL 1-9).

TRL Scale: 1-3=Basic Research, 4-5=Applied/Proof of Concept, 6-7=Prototype/Demo, 8-9=Operational

Abstracts:
{combined}

Respond ONLY in valid JSON format, no extra text:
{{
    "trl_level": <number 1-9>,
    "confidence": <number 0-100>,
    "reasoning": "<2-3 sentence explanation>",
    "key_drivers": ["driver1", "driver2", "driver3"],
    "next_milestone": "<what needs to happen to reach next TRL>"
}}"""
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=500
        )
        content = response.choices[0].message.content.strip()
        return {"success": True, "data": json.loads(content)}
    except Exception as e:
        print(f"Groq TRL Assessment Error: {e}")
        return {"success": False, "error": str(e)}

def generate_technology_summary(query, papers_count, patents_count, news_count):
    client = get_client()
    prompt = f"""Generate a strategic technology intelligence brief for: "{query}"
Available data: {papers_count} research papers, {patents_count} patents, {news_count} recent news articles.

Provide a structured brief with:
1. Executive Summary (3 sentences)
2. Current Maturity Assessment
3. Key Growth Drivers (3 bullet points)
4. Strategic Implications for Defence R&D
5. Recommended Focus Areas

Professional tone, precise language, defence-domain relevant."""
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=800
        )
        return {"success": True, "summary": response.choices[0].message.content}
    except Exception as e:
        print(f"Groq Summary Error: {e}")
        return {"success": False, "error": str(e)}

def generate_hype_cycle_position(technology, papers_data, patents_data):
    client = get_client()
    prompt = f"""Analyze "{technology}" and determine its position on the technology hype cycle.

Data: {len(papers_data)} papers, {len(patents_data)} patents

Respond in JSON:
{{
    "position": "Innovation Trigger|Peak of Inflated Expectations|Trough of Disillusionment|Slope of Enlightenment|Plateau of Productivity",
    "years_to_maturity": <number>,
    "adoption_rate": "Low|Medium|High",
    "market_maturity": "Emerging|Growing|Mature|Declining"
}}"""
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=300
        )
        content = response.choices[0].message.content.strip()
        return {"success": True, "data": json.loads(content)}
    except Exception as e:
        print(f"Groq Hype Cycle Error: {e}")
        return {"success": False, "error": str(e)}
