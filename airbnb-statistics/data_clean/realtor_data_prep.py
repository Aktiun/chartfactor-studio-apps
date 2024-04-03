import os
import datetime
import requests
import io
import pandas as pd

import index_realtor_data

CORE_ZIP_DATA = "https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_Zip_History.csv"
DOWNLOAD_CSV_NAME_ZIP = "realtors_zip_data.csv"

def readURL(url):
    print("Reading url: ", url)
    req = requests.get(url)
    if req.ok:
        data = req.content.decode('utf8')
        result = pd.read_csv(io.StringIO(data))
    else:
        print("Error downloading %s with error %r" % (url, req.reason))

    return result

def pull_and_index():
    path = "../data/"
    csv_file_zip = path + DOWNLOAD_CSV_NAME_ZIP
    if not os.path.exists(path):
        os.makedirs(path)

    # Download from Real Estate site
    inventory_zip = readURL(CORE_ZIP_DATA)

    # Clean up data
    im_zip = inventory_zip.fillna(0)
    im_zip = im_zip.replace("Infinity", "0")
    im_zip = im_zip.replace("#NAME?", "0")
    print("Creating file ", csv_file_zip)
    im_zip.to_csv(csv_file_zip, index=False)

    # Load in Elasticsearch
    index_realtor_data.main()

if __name__ == "__main__":
    pull_and_index()