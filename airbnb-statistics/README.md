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

1. go to the root of this project in a terminal, I assume you are in `chartfactor-studio-apps`.

`cd airbnb-statistics`

2. (WIP) Copy all the `.csv.gz` files in any folder, all of them in the same folder (no more than compressed files should live in that forder), and run the python script `uncompress.py`.

`python -m data_clean/uncompress.py -s compressed_files_path -d uncompressed_files_path`

`uncompressed_files_path` could be any location in your machine.

3. (WIP) Join all files in one using

`python -m data_clean/join_datasets.py -s uncompressed_files_path -d data_folder_path`

`data_folder_path` is the path to `data` folder in this project.

3. Index data in ElastikSearch using `index.py`

`python -m data_clean/index.py`