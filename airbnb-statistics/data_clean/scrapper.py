import requests
import json
import os
import logging
import re
from bs4 import BeautifulSoup
from urllib.parse import quote

logger = logging.getLogger("listings_abnb")

def normalize_filename(filename):
    normalized_filename = re.sub(r'[^a-zA-Z0-9]', '_', filename)
    return normalized_filename

def get_listings_links(is_whole_world: bool = False) -> dict:
    url = 'http://insideairbnb.com/get-the-data.html'

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all('a')
    listings_links = {}

    for index, link in enumerate(links):
        href = link.get('href')
        id = None
        if href and 'data/listings.csv.gz' in href:
            id = f"ID_{index}"
            listings_links[id] = href

    if not is_whole_world:
        listings_links = {k: v for k, v in listings_links.items() if 'united-states' in v}

    logger.info(f"Found {len(listings_links)} listings links.")
    # logger.info(f"Links: {listings_links}")
    return listings_links

def get_calendar_links(is_whole_world: bool = False) -> dict:
    url = 'http://insideairbnb.com/get-the-data.html'

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all('a')
    calendar_links = {}

    for index, link in enumerate(links):
        href = link.get('href')
        id = None
        if href and 'data/calendar.csv.gz' in href:
            id = f"ID_{index}"
            calendar_links[id] = href

    if not is_whole_world:
        calendar_links = {k: v for k, v in calendar_links.items() if 'united-states' in v}

    logger.info(f"Found {len(calendar_links)} calendar links.")
    return calendar_links

def download_file(url: str, local_filename: str, path_to_save: str) -> bool:
    response = requests.get(url)
    if response.status_code == 200:
        with open(path_to_save, 'wb') as file:
            file.write(response.content)
        logger.info(f"File {local_filename} downloaded.")
        return True
    else:
        logger.error(f"Error downloading: {url}")
        return False


def get_listings_files(is_whole_world: bool = False) -> bool:
    listings_links = get_listings_links(is_whole_world)
    calendar_links = get_calendar_links(is_whole_world)

    download_directory = "../tmp_downloaded/"
    os.makedirs(download_directory, exist_ok=True)
    downloads_info = {}
    for id, url in listings_links.items():
        country = url.split("/")[-6]
        province = url.split("/")[-5]
        place = url.split("/")[-4]
        name = f"{country}_{province}_{place}"
        normalized_url = quote(url, safe=':/')
        local_filename = f"{id}_{normalize_filename(name)}_listings.csv.gz"
        path_to_save = os.path.join(download_directory, local_filename)
        download_file(normalized_url, local_filename, path_to_save)

    for id, url in calendar_links.items():
        country = url.split("/")[-6]
        province = url.split("/")[-5]
        place = url.split("/")[-4]
        name = f"{country}_{province}_{place}"
        normalized_url = quote(url, safe=':/')
        local_filename = f"{id}_{normalize_filename(name)}_calendar.csv.gz"
        path_to_save = os.path.join(download_directory, local_filename)
        download_file(normalized_url, local_filename, path_to_save)
