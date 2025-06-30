import yaml
import requests
from urllib.parse import urlparse, parse_qs
import os
from collections import Counter
import re
from datetime import datetime
import argparse
import shutil

# Configuration files
RSS_FEEDS_FILE = "etc/rss_feeds.yaml"
URLS_CONFIG_FILE = "etc/urls.yaml"
OUTPUT_DIR = "output"
CACHE_DIR = ".cache/20250630" # Using a fixed date for now, can be made dynamic

def load_config(file_path):
    with open(file_path, 'r') as f:
        return yaml.safe_load(f)

def fetch_url_content(url, cache_path):
    if os.path.exists(cache_path):
        with open(cache_path, 'r') as f:
            return f.read()
    else:
        print(f"Fetching {url}...")
        response = requests.get(url)
        response.raise_for_status()
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)
        with open(cache_path, 'w') as f:
            f.write(response.text)
        return response.text

def extract_links_from_html(html_content):
    links = re.findall(r'href="([^"]+)"', html_content)
    return links

def has_utm_params(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    return any(key.startswith('utm_') for key in query_params)

def get_b_number(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    utm_campaign = query_params.get('utm_campaign', [''])[0]
    match = re.search(r'b([0-9]+)', utm_campaign)
    if match:
        return match.group(1)
    return None

def extract_title_from_html(html_content):
    title_pattern = r'<title data-rh="true">(.*?)</title>'
    title_match = re.search(title_pattern, html_content, re.DOTALL)
    if title_match:
        title = title_match.group(1)
        # Remove common Medium suffixes and author info
        title = re.sub(r' \| by [^\|]+ \| Google Cloud - Community \| [A-Za-z]+, [0-9]{4} \| Medium', '', title)
        title = re.sub(r' \| by [^\|]+ \| [A-Za-z]+, [0-9]{4} \| Medium', '', title)
        title = re.sub(r' \| by [^\|]+ \| Medium', '', title)
        title = re.sub(r'\. As a rubyist, I love gems\.', '', title) # Specific for "Gemma is born" case
        title = title.replace('|', '\\|') # Escape pipe characters for Markdown table
        return title.strip()
    return "Unknown Title"

def extract_author_from_html(html_content):
    # More robust author extraction
    author_match = re.search(r'<meta name="author" content="([^"]+)">', html_content)
    if author_match:
        return author_match.group(1).strip()
    # Fallback to og:title if author meta tag is not found
    author_match = re.search(r'<meta data-rh="true" property="og:title" content=".*? \| by ([^\|]+)', html_content)
    if author_match:
        return author_match.group(1).strip()
    return "Unknown Author"

def main():
    parser = argparse.ArgumentParser(description="UTM Crawler for Medium articles.")
    parser.add_argument("--no-cache", action="store_true", help="Clear cache before crawling.")
    args = parser.parse_args()

    if args.no_cache and os.path.exists(CACHE_DIR):
        print(f"Clearing cache directory: {CACHE_DIR}")
        shutil.rmtree(CACHE_DIR)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(CACHE_DIR, exist_ok=True)

    rss_feeds_config = load_config(RSS_FEEDS_FILE)
    urls_config = load_config(URLS_CONFIG_FILE)
    
    urls_which_require_substitution = urls_config.get('urls_which_require_substitution', [])
    article_denylist_keywords = urls_config.get('article_denylist_keywords', [])

    all_articles_data = []

    for rss_feed_url in rss_feeds_config.get('rss_feeds', []):
        print(f"Processing RSS feed: {rss_feed_url}")
        rss_cache_path = os.path.join(CACHE_DIR, os.path.basename(rss_feed_url).replace('/', '_'))
        rss_content = fetch_url_content(rss_feed_url, rss_cache_path)

        # Improved RSS parsing to get article links and titles
        article_entries = re.findall(r'<item>(.*?)</item>', rss_content, re.DOTALL)
        
        for entry in article_entries:
            link_match = re.search(r'<link>(.*?)</link>', entry)
            title_match = re.search(r'<title>(.*?)</title>', entry)
            pub_date_match = re.search(r'<pubDate>(.*?)</pubDate>', entry)
            
            if link_match and title_match:
                article_url = link_match.group(1)
                article_title = title_match.group(1).strip() # Use title from RSS directly
                pub_date_str = pub_date_match.group(1).strip() if pub_date_match else "Unknown Date"

                # Filter out non-article links more robustly
                # Check if the URL path has at least two segments after the domain (e.g., /author/slug)
                parsed_url_path = urlparse(article_url).path.strip('/').split('/')
                if len(parsed_url_path) < 2:
                    print(f"  Skipping non-article link: {article_url}")
                    continue

                # Apply denylist filtering
                skip_article = False
                for keyword in article_denylist_keywords:
                    if keyword.lower() in article_title.lower() or keyword.lower() in article_url.lower():
                        print(f"  Skipping article due to denylist keyword '{keyword}': {article_url}")
                        skip_article = True
                        break
                if skip_article:
                    continue

                print(f"  Processing article: {article_url}")
                
                article_slug = parsed_url_path[-1]

                # Determine author slug for local report directory
                author_slug = "unknown_author"
                if parsed_url_path[0].startswith('@'):
                    author_slug = parsed_url_path[0].lstrip('@')
                elif len(parsed_url_path) > 1 and parsed_url_path[0] == 'google-cloud':
                    # Special handling for google-cloud publication
                    author_slug = 'google-cloud'
                
                local_report_dir = os.path.join(OUTPUT_DIR, 'medium.com', author_slug)
                local_report_filename = article_slug + ".md"
                local_report_path = os.path.join(local_report_dir, local_report_filename)
                
                article_cache_filename = article_slug + ".html"
                article_cache_path = os.path.join(CACHE_DIR, article_cache_filename)

                try:
                    article_html = fetch_url_content(article_url, article_cache_path)
                    # Re-extract title from HTML for robustness, and clean it
                    article_title = extract_title_from_html(article_html) or article_title
                    article_author = extract_author_from_html(article_html)

                    all_links = extract_links_from_html(article_html)

                    utms_applied = []
                    missing_utms = []
                    other_urls = []

                    for link in all_links:
                        is_local = link.startswith('/') or link.startswith('#')
                        if is_local:
                            continue # Ignore local links for this analysis

                        link_domain = urlparse(link).netloc
                        requires_utm = any(domain in link_domain for domain in urls_which_require_substitution)
                        has_utm = has_utm_params(link)

                        if requires_utm:
                            if has_utm:
                                utms_applied.append(link)
                            else:
                                missing_utms.append(link)
                        else:
                            other_urls.append(link)
                    
                    # Deduplicate and count other_urls
                    other_urls_counts = Counter(other_urls)
                    formatted_other_urls = []
                    for url, count in other_urls_counts.most_common():
                        if count > 1:
                            formatted_other_urls.append(f"* `{url}` {count}x")
                        else:
                            formatted_other_urls.append(f"* `{url}`")

                    # Extract B-numbers
                    b_numbers = []
                    for link in utms_applied:
                        b_num = get_b_number(link)
                        if b_num:
                            b_numbers.append(f"[b/{b_num}](http://b/{b_num})")
                    
                    b_numbers_str = ", ".join(sorted(list(set(b_numbers)))) if b_numbers else "N/A"

                    # Prepare report content
                    report_content = f"# Warning on Medium links\n\nNote that checking for links in an articles is NOT equivalent to getting all links in that URL.\n\n- 90% of links are from Medium, other articles, other things.\n- Links for the article itself should start after the title (h1) and somewhat finishing at the clapping hands. In the Chrome Ext link, for instance, the article ends with this sentence:\n  - Try this “Getting started with Gemini CLI” codelab from Aaron and me!\n\n**Report for Article: `{article_title}`**\n\n**Overall Status:** {'OK' if not missing_utms else 'Missing Actions'}\n\n**URLs with UTMs:**\n"
                    for link in utms_applied:
                        report_content += f"* `{link}`\n"
                    if not utms_applied:
                        report_content += "* None\n"

                    report_content += f"\n**Missing UTMs (matching `urls_which_require_substitution` but no UTMs):**\n"
                    for link in missing_utms:
                        report_content += f"* `{link}`\n"
                    if not missing_utms:
                        report_content += "* None\n"

                    report_content += f"\n**All other URLs (irrelevant to this analysis):**\n"
                    for line in formatted_other_urls:
                        report_content += f"{line}\n"
                    if not formatted_other_urls:
                        report_content += "* None\n"

                    os.makedirs(local_report_dir, exist_ok=True)
                    with open(local_report_path, 'w') as f:
                        f.write(report_content)
                    
                    all_articles_data.append({
                        'title': article_title,
                        'local_path': os.path.relpath(local_report_path, OUTPUT_DIR),
                        'remote_url': article_url,
                        'utms_applied_count': len(utms_applied),
                        'missing_utms_count': len(missing_utms),
                        'b_numbers': b_numbers_str,
                        'pub_date': datetime.strptime(pub_date_str, '%a, %d %b %Y %H:%M:%S GMT').strftime('%Y%m%d'),
                        'author': article_author
                    })

                except requests.exceptions.RequestException as e:
                    print(f"Error fetching {article_url}: {e}")
                except Exception as e:
                    print(f"Error processing {article_url}: {e}")

    # Sort articles by date
    all_articles_data.sort(key=lambda x: x['pub_date'], reverse=True)

    # Generate the meta-report
    meta_report_content = "# UTM Analysis Report\n\n| Date | Article Title | Remote Link | UTMs Applied | Missing UTMs | B-Numbers |\n|---|---|---|---|---|---|\n"
    for article_data in all_articles_data:
        meta_report_content += f"| {article_data['pub_date']} | [{article_data['title']} ({article_data['author']})]({article_data['local_path']}) | [🔗]({article_data['remote_url']}) | {article_data['utms_applied_count']} | {article_data['missing_utms_count']} | {article_data['b_numbers']} |\n"

    with open(os.path.join(OUTPUT_DIR, "REPORT.md"), 'w') as f:
        f.write(meta_report_content)

    print("UTM analysis complete. Reports generated.")

if __name__ == "__main__":
    main()