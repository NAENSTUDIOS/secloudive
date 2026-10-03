"""
SeCloudive & Antigravity Daily AWS Ingest & Gemini Summarization Pipeline
Fetches updates from AWS What's New RSS, processes breaking changes,
and prepares structured briefings for the mentor and live feed engines.
"""

import os
import sys
import urllib.request
import xml.etree.ElementTree as ET
import json
import time

def ingest_daily_aws_updates():
    rss_urls = [
        ("AWS What's New", "https://aws.amazon.com/about-aws/whats-new/recent/feed/"),
        ("AWS Security Blog", "https://aws.amazon.com/blogs/security/feed/"),
        ("AWS Architecture Blog", "https://aws.amazon.com/blogs/architecture/feed/")
    ]
    
    headers = {'User-Agent': 'AntigravityIngest/2.0 (SeCloudive Enterprise)'}
    collected_articles = []

    print("[*] Starting Daily AWS Feeds Ingestion...")
    
    for feed_name, url in rss_urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                xml_data = response.read()
            
            root = ET.fromstring(xml_data)
            items = root.findall('./channel/item')[:3] # Process top 3 from each
            print(f"[+] Retrieved {len(items)} items from {feed_name}")

            for item in items:
                title = item.find('title').text if item.find('title') is not None else "Untitled"
                link = item.find('link').text if item.find('link') is not None else ""
                desc = item.find('description').text if item.find('description') is not None else ""
                pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""

                collected_articles.append({
                    "source": feed_name,
                    "title": title,
                    "link": link,
                    "description": desc[:300] + "..." if len(desc) > 300 else desc,
                    "pubDate": pub_date,
                    "ingestedAt": time.strftime("%Y-%m-%d %H:%M:%S")
                })
        except Exception as e:
            print(f"[-] Warning: Failed to fetch {feed_name}: {e}")

    # Output JSON bundle for frontend or DB import
    output_path = os.path.join(os.path.dirname(__file__), "daily_aws_brief.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(collected_articles, f, indent=2)
    
    print(f"[✓] Successfully ingested {len(collected_articles)} AWS updates into {output_path}")
    return collected_articles

if __name__ == "__main__":
    ingest_daily_aws_updates()
