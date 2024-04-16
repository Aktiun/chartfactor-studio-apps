import os
import logging
import pandas as pd
import argparse

logger = logging.getLogger("listings_abnb")

headers = (
    "id",
    "listing_url",
    "scrape_id",
    "last_scraped",
    "source",
    "name",
    "description",
    "neighborhood_overview",
    "picture_url",
    "host_id",
    "host_url",
    "host_name",
    "host_since",
    "host_location",
    "host_about",
    "host_response_time",
    "host_response_rate",
    "host_acceptance_rate",
    "host_is_superhost",
    "host_thumbnail_url",
    "host_picture_url",
    "host_neighbourhood",
    "host_listings_count",
    "host_total_listings_count",
    "host_verifications",
    "host_has_profile_pic",
    "host_identity_verified",
    "neighbourhood",
    "neighbourhood_cleansed",
    "neighbourhood_group_cleansed",
    "latitude",
    "longitude",
    "property_type",
    "room_type",
    "accommodates",
    "bathrooms",
    "bathrooms_text",
    "bedrooms",
    "beds",
    "amenities",
    "price",
    "minimum_nights",
    "maximum_nights",
    "minimum_minimum_nights",
    "maximum_minimum_nights",
    "minimum_maximum_nights",
    "maximum_maximum_nights",
    "minimum_nights_avg_ntm",
    "maximum_nights_avg_ntm",
    "calendar_updated",
    "has_availability",
    "availability_30",
    "availability_60",
    "availability_90",
    "availability_365",
    "calendar_last_scraped",
    "number_of_reviews",
    "number_of_reviews_ltm",
    "number_of_reviews_l30d",
    "first_review",
    "last_review",
    "review_scores_rating",
    "review_scores_accuracy",
    "review_scores_cleanliness",
    "review_scores_checkin",
    "review_scores_communication",
    "review_scores_location",
    "review_scores_value",
    "license",
    "instant_bookable",
    "calculated_host_listings_count",
    "calculated_host_listings_count_entire_homes",
    "calculated_host_listings_count_private_rooms",
    "calculated_host_listings_count_shared_rooms",
    "reviews_per_month",
)


def are_headers_correct(file):
    """
    Verify if all files have the same headers.
    """
    df = pd.read_csv(file, nrows=0)  # read only the header
    headers = tuple(df.columns.tolist())
    return headers == headers


def clean_data(df):
    """
    Clean the ID column and remove empty records.
    """
    df = df[df['id'].str.strip() != '']

    return df


def get_occupied_days(df, listing_id):
    # print(f"Get occupied days for listing_id: {listing_id}")
    # Filter rows where "listing_id" matches the provided listing_id
    listing_df = df[df["listing_id"] == listing_id]

    # If the listing_id exists in the DataFrame, return the occupied_days
    if not listing_df.empty:
        return listing_df.iloc[0]['occupied_days']
    else:
        return None


def combine_csv_files(source_dir, output_file):
    """
    combine all CSV files in source directory into a single file.
    """
    csv_files = [
        os.path.join(source_dir, f)
        for f in os.listdir(source_dir)
        if f.endswith(".csv") and 'calendar' not in f
    ]

    if not csv_files:
        print("No csv files found in the source directory.")
        return
    dfs = []

    calendar_input_path = '../tmp_joined/calendars.csv'
    # Read the calendar CSV file
    print(f"Reading calendar file from {calendar_input_path}")
    df_calendar = pd.read_csv(calendar_input_path, dtype={'listing_id': str})

    for file in csv_files:
        if not are_headers_correct(file):
            logger.error(f"Error: File {file} has different headers.")
            continue
        logger.info(f"Processing file: {file}")
        # read id column as string when reading the file
        df = pd.read_csv(file, dtype={"id": str})
        if "united_states" in file:
            df["is_usa"] = True
        else:
            df["is_usa"] = False
        df['id'] = df['id'].astype(str)
        df['is_usa'] = df['is_usa'].astype(bool)
        df['host_id'] = df['host_id'].astype(str)

        # Calculate estimated occupied time and income in the last twelve months
        if df_calendar is not None:
            df['estimated_occupied_time'] = df['id'].apply(lambda x: get_occupied_days(df_calendar, x) or 0)
        else:
            df['estimated_occupied_time'] = df['id'].apply(lambda x: 0)

        df_cleaned = clean_data(df)
        df_cleaned = df_cleaned.loc[:, ~df_cleaned.columns.str.startswith('region')]
        df_cleaned = df_cleaned.loc[:, ~df_cleaned.columns.isin(['last_searched', 'requires_license'])]
        dfs.append(df_cleaned)
    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df.to_csv(output_file, index=False)
    logger.info(f"Combined file: {output_file}")


def join_calendar_listings(source_dir, output_file):
    """
    Join calendar CSV files into a single file.
    """
    csv_files = [
        os.path.join(source_dir, f)
        for f in os.listdir(source_dir)
        if f.endswith(".csv") and 'calendar' in f
    ]
    final_df = pd.DataFrame(columns=["listing_id", "occupied_days"])

    # Iterate over all CSV files in the directory
    for file in csv_files:
        logger.info(f"Processing file: {file}")
        # Construct the full file path

        # Read the CSV file into a DataFrame
        df = pd.read_csv(file, dtype={"listing_id": str})

        # Filter rows where "available" column is "t"
        available_t_df = df[df["available"] == "t"]

        # Group by "listing_id" and count the records
        count_by_listing_id = available_t_df.groupby("listing_id").size().reset_index(name='occupied_days')

        # Append the result to the final DataFrame
        final_df = pd.concat([final_df, count_by_listing_id], ignore_index=True)

    # Write the final DataFrame to a new CSV file
    final_df.to_csv(output_file, index=False)



def main():
    parser = argparse.ArgumentParser(
        description="Combine all CSV files with the same structure into a single file."
    )
    parser.add_argument(
        "-s", "--source", required=True, help="Source path where CSV files live."
    )

    args = parser.parse_args()

    if not os.path.isdir(args.source):
        raise Exception("Source path not found")

    combine_csv_files(args.source, "../tmp_joined/joined.csv")


if __name__ == "__main__":
    main()
