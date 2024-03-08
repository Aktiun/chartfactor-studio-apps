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
    Clean the ID column, converting to numeric and handling non-numeric values.
    """
    df.dropna(subset=["id"], inplace=True)

    return df


def combine_csv_files(source_dir, output_file):
    """
    combine all CSV files in source directory into a single file.
    """
    csv_files = [
        os.path.join(source_dir, f)
        for f in os.listdir(source_dir)
        if f.endswith(".csv")
    ]
    if not csv_files:
        print("No csv files found in the source directory.")
        return
    dfs = []
    for file in csv_files:
        if not are_headers_correct(file):
            logger.error(f"Error: File {file} has different headers.")
            continue
        logger.info(f"Processing file: {file}")
        df = pd.read_csv(file)
        df_cleaned = clean_data(df)
        dfs.append(df_cleaned)
    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df.to_csv(output_file, index=False)
    logger.info(f"Combined file: {output_file}")


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

    combine_csv_files(args.source, "../data/abnb_listings.csv")


if __name__ == "__main__":
    main()
