# AirB&B Statistics

This is a web app developed using ChartFactor to create useful and interesting visualizations of free Air B&B data available [here](http://insideairbnb.com/get-the-data/).

## Steps to setup dev env
1. Install Elastik Search 7 (no 8+)
2. Clean the data (used `listings.csv.gz` files)
3. Start local web server

### 1. Install Elastik Search
TODO:

### 2. Clean the data
There are some sub steps that we need to acomplish to complete this step in order to complete this process.

1. Create a python virtual env: (WIP)


1. go to the data clean folder on this project in a terminal, I assume you are in `chartfactor-studio-apps`.

`cd airbnb-statistics/data_clean`

2. Copy all the `.csv.gz` files in any folder, all of them in the same folder (no more than compressed files should live in that forder), and run the python script `unzip.py`.

`python unzip.py -s compressed_files_path -d uncompressed_files_path`

`uncompressed_files_path` could be any location in your machine.

3. Join all files in one using

`python join.py -s uncompressed_files_path`

After `join.py` execution, there should be a file named `abnb_listings.csv` in the `data` folder on this project.

3. Index data in ElastikSearch using `index.py`

`python index.py`