from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as bs
import json
import urllib.parse
import re
import os

# Prompt the user to enter a URL
url_to_scrape = input("Please enter the URL you wish to scrape: ")

directory = "/Users/siddharth/Downloads/zomatojsons"

# Extract the domain and path to create a filename
parsed_url = urllib.parse.urlparse(url_to_scrape)
filename_base = re.sub(r'\W+', '_', parsed_url.netloc.replace("www.", "").replace("zomato", "").replace(".com", "") + parsed_url.path.replace("/order", "").replace("bangalore", "")).rstrip('_')
filename = filename_base + ".json"

if not os.path.exists(directory):
    os.makedirs(directory)

filename_path = os.path.join(directory, filename)

print(filename_path)

d = webdriver.Chrome()
d.get(url_to_scrape)

# Wait for the presence of the main element
main_element = WebDriverWait(d, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "main > div > section > section > section > section > div > div > div > div > div > div > div")))      
soup = bs(d.page_source, 'lxml')

headings = []
body_texts = []

for section in soup.select("main > div > section > section > section > section > div > div > div > div > div > div > div"):
    # Extracting the heading
    heading = section.select_one('h4')
    if heading:
        headings.append(heading.text.strip())

for section in soup.select("main > div > section > section > section > section > div > div > div > div > div"):
    # Extracting the body text
    body_text = section.select_one('p')
    if body_text:
        body_texts.append(body_text.text.strip())

# Combine headings and body texts
combined_texts = []
for h, b in zip(headings, body_texts):
    combined_texts.append({
        "heading": h,
        "body_text": b
    })

# Export as JSON
with open(filename_path, "w") as f:
    json.dump(combined_texts, f, ensure_ascii=False, indent=4)

d.quit()  # Ensure to close the browser after scraping