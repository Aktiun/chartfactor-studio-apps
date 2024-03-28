# AirB&B Statistics

This is a web app developed using ChartFactor to create useful and interesting visualizations of free Air B&B data available [here](http://insideairbnb.com/get-the-data/).

## Steps to setup dev env
1. Install Elastik Search 7 (no 8+)
2. Clean the data (used `listings.csv.gz` files)
3. Start local web server

### 1. Install Elastik Search
TODO:

### 2. Clean and Index Data
There are some steps that we need to execute to acomplish this process. I assume you are in the `chartfactor-studio-apps/airbnb-statistics` folder in the terminal.

1. Create a python virtual env:
`python -m venv venv`

2. Activate the virtual env:
`source venv/bin/activate`

3. Go to the data clean folder and install python requirements:
`cd data_clean`
`pip install -r requirements.txt`

4. Execute `data_prep.py`.

`python data_prep.py`

This will download the files, unzip, join and index in elastiksearch. The process would take around 10 minutes. The logs for this process are written to `abnb_listings_log` in `data_clean` folder.

When the process finishes, you can delete all the files in `tmp_compressed`, `tmp_unzipped`, `tmp_downloaded`, `tmp_joined` and also you can delete the file `abnb_listings.csv` in `data` folder.

### (Optional) Zip optimizer
In order to decrease the time needed to run `data_prep` clean scripts, we created a python script that reads a parquet file with listing ids and zipcodes. This allows us to minimize the time needed to get the zipcode of the listings because we only geocode the missing ones.

#### Update parquet file
To update `abnb_zipcode.parquet` you must be in `data_prep` folder and follow the next scripts in order:
1. Run `python data_prep.py`
2. Delete `abnb_zipcode.parquet` in `data` folder
2. Run `python zip_optimizer.py`
With this, the next time you run `data_prep.py` you will use an updated version of `abnb_zipcode.parquet` for your data clean, and should take less time to complete the process.