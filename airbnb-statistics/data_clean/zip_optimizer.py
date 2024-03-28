import pandas as pd

def split_zipcode_data():
    # Read csv using pandas
    df = pd.read_csv('../data/abnb_listings.csv', dtype={'id': str})

    # ptint count of records
    print(df.shape)

    # Get records with `zipcode` not null
    df_no_null_zipcode = df[df['zipcode'].notnull()]

    # Select only `id` and zipcode columns
    df_no_null_zipcode = df_no_null_zipcode[['id', 'zipcode']]

    # pint count
    print(df_no_null_zipcode.shape)

    #print schema
    print(df_no_null_zipcode.dtypes)

    # ptrint first 10 records
    print(df_no_null_zipcode.head(10))

    # set id and zipcode as string
    df_no_null_zipcode['id'] = df_no_null_zipcode['id'].astype(str)
    df_no_null_zipcode['zipcode'] = df_no_null_zipcode['zipcode'].astype(str)
    
    # remove decimals from zipcode
    df_no_null_zipcode['zipcode'] = df_no_null_zipcode['zipcode'].str.split('.').str[0]

    # Save to parquet
    df_no_null_zipcode.to_parquet('../data/abnb_zipcode.parquet', index=False)


def main():
    split_zipcode_data()

if __name__ == '__main__':
    main()