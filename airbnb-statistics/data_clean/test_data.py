import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv("calendar.csv")

# Filter rows where "available" column is "t"
available_t_df = df[df["available"] == "t"]

# Group by "listing_id" and count the records
count_by_listing_id = available_t_df.groupby("listing_id").size()

# Print the result
specific_listing_id = 1489424

listingOccupancy = count_by_listing_id.loc[specific_listing_id]

print(f"Listing {specific_listing_id} has {listingOccupancy} occupied days.")