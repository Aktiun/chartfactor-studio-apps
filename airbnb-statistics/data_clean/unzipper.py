import os
import gzip
import shutil
import argparse
import logging

logger = logging.getLogger("listings_abnb")

def unzip_gz_file(source_path, dest_path):
    """
    Unzip .gz file and save in destination.
    """
    with gzip.open(source_path, 'rb') as f_in:
        with open(dest_path, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)

def process_directory(source_dir, dest_dir):
    """
    Loop over all files in source directory to unzip each one.
    """
    for filename in os.listdir(source_dir):
        if filename.endswith('.gz'):
            source_path = os.path.join(source_dir, filename)
            dest_filename = filename[:-3]
            dest_path = os.path.join(dest_dir, dest_filename)
            unzip_gz_file(source_path, dest_path)
            logger.info(f"Unzipped file: {dest_path}")

def main():
    parser = argparse.ArgumentParser(description='Unzip files .csv.gz from a source path to a destination path.')
    parser.add_argument('-s', '--source', required=True, help='source path, where files .csv.gz live')
    parser.add_argument('-d', '--destination', required=True, help='destination path, where unzipped files will be saved')

    args = parser.parse_args()

    if not os.path.isdir(args.source):
        raise Exception("Source path not found")
    if not os.path.isdir(args.destination):
        raise Exception("Destination path not found")

    process_directory(args.source, args.destination)

if __name__ == "__main__":
    main()
