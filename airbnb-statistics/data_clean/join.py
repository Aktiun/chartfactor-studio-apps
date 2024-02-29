import os
import pandas as pd
import argparse

def verify_headers(files):
    """
    Verify if all files have the same headers.
    """
    header_set = set()  # unique headers
    for file in files:
        df = pd.read_csv(file, nrows=0)  # read only the header
        headers = tuple(df.columns.tolist())
        header_set.add(headers)
    return len(header_set) == 1

def clean_data(df):
    """
    Clean the ID column, converting to numeric and handling non-numeric values.
    """
    df.dropna(subset=['id'], inplace=True)

    return df

def combine_csv_files(source_dir, output_file):
    """
    combine all CSV files in source directory into a single file.
    """
    csv_files = [os.path.join(source_dir, f) for f in os.listdir(source_dir) if f.endswith('.csv')]
    if not csv_files:
        print("No csv files found in the source directory.")
        return
    
    if verify_headers(csv_files):
        dfs = []
        for file in csv_files:
            df = pd.read_csv(file)
            df_cleaned = clean_data(df)
            dfs.append(df_cleaned)
        combined_df = pd.concat(dfs, ignore_index=True)
        combined_df.to_csv(output_file, index=False)
        print(f"Combined file: {output_file}")
    else:
        print("Error: Not all files have the same headers.")

def main():
    parser = argparse.ArgumentParser(description='Combine all CSV files with the same structure into a single file.')
    parser.add_argument('-s', '--source', required=True, help='Source path where CSV files live.')

    args = parser.parse_args()

    if not os.path.isdir(args.source):
        raise Exception("Source path not found")
    
    combine_csv_files(args.source, "../data/abnb_listings.csv")

if __name__ == "__main__":
    main()
