# Airbnb listings and US market stats

This is a web app developed using ChartFactor to create useful and interesting visualizations of free Airbnb data made available by [InsideAirbnb](http://insideairbnb.com/get-the-data/) as well as US market statistics with data provided by [Realtor.com](https://realtor.com).

## Steps to setup dev env
1. Install Elastik Search 7 (no 8+)
2. Clean the data (used `listings.csv.gz` files)
3. Index Realtor data
4. Start local web server

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

This will download the files, unzip, join and index in elastiksearch (for USA cities only). The process would take around 10 minutes. The logs for this process are written to `abnb_listings_log` in `data_clean` folder.

When the process finishes, you can delete all the files in `tmp_compressed`, `tmp_unzipped`, `tmp_downloaded`, `tmp_joined` and also you can delete the file `abnb_listings.csv` in `data` folder.

#### Important: you could index the listings for all cities in [idealairbnb.com](http://insideairbnb.com/get-the-data/) adding `all` to data prep command:
`python data_prep.py all`

### (Optional) Zip optimizer
In order to decrease the time needed to run `data_prep` clean scripts, we created a python script that reads a parquet file with listing ids and zipcodes. This allows us to minimize the time needed to get the zipcode of the listings because we only geocode the missing ones.

#### Update parquet file
To update `abnb_zipcode.parquet` you must be in `data_clean` folder and follow the next scripts in order:
1. Delete `abnb_zipcode.parquet` in `data` folder
2. Run `python data_prep.py`
3. Run `python zip_optimizer.py`
With this, the next time you run `data_prep.py` you will use an updated version of `abnb_zipcode.parquet` for your data clean, and should take less time to complete the process.

### 3. Index Realtor data

run `python realtor_data_prep.py`.

#### Important: Realtor updates this data every month, approx 7th each month. If you want to get the latest data just re run `realtor_data_prep` script when you need.


### 4. Start web server

Go to project folder, from `data_clean` forder, you could use:
`cd ..` and run `python3 -m http.server <port>` where `<port>` is the port number you want to use, for example:
`python3 -m http.server 8313`.

Then the web app will be available in `http://localhost:8113/src/`