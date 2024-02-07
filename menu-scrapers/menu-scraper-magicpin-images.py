import os
import requests
import urllib.parse
import re
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# Prompt the user to enter a URL
url_to_scrape = input("Please enter the Magicpin URL to scrape: ")

# Validate the URL
if not url_to_scrape.startswith("http"):
    print("Please enter a valid URL starting with http:// or https://")
    exit()

# Set Chrome options to disable notifications
chrome_options = Options()
chrome_options.add_argument("--disable-notifications")

# Set up the webdriver with chrome options
driver = webdriver.Chrome(options=chrome_options)
driver.get(url_to_scrape)

# Directory based on the URL
parsed_url = urllib.parse.urlparse(url_to_scrape)
directory_name = re.sub(r'\W+', '_', parsed_url.netloc + parsed_url.path).rstrip('_').replace('https_', '').replace('www_', '').replace('magicpin_', '').replace('com_', '')

directory = os.path.join("/Users/siddharth/Downloads/zomato_images", directory_name)
if not os.path.exists(directory):
    os.makedirs(directory)

# Click the first thumbnail to open the carousel
wait = WebDriverWait(driver, 15)
first_thumbnail = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pswp-thumbnail img")))
first_thumbnail.click()

# Scrape images from the carousel
index = 0
first_image_url = ""  # Initialize this variable to store the first image's URL
while True:
    try:
        # Wait for the high-res image to be loaded
        high_res_img_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "img.pswp__img")))
        high_res_img_url = high_res_img_element.get_attribute("src")

        # If it's the first iteration, set the first image's URL
        if index == 0:
            first_image_url = high_res_img_url
        # If not the first iteration, compare with the first image's URL
        elif high_res_img_url == first_image_url:
            break  # Break out of the loop if the URLs match

        # Fetch and save the image using requests
        response = requests.get(high_res_img_url, stream=True)
        filename = os.path.join(directory, f"image_{index}.jpg")
        with open(filename, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)

        # Click the "next" button to navigate to the next image
        next_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".pswp__button--arrow--right")))
        next_button.click()

        time.sleep(2)  # Introduce a delay after clicking the "next" button

        index += 1
    except Exception as e:
        print(f"Error processing image {index}: {e}")
        break  # Exit the loop if any error occurs

driver.quit()
