#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Check if the necessary environment variables are set
if [ -z "$DB_DATABASE" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_PORT" ] || [ -z "$DB_HOST" ]; then
  echo "One or more environment variables are missing. Please check your .env file."
  exit 1
fi

# Construct the MongoDB connection URL
MONGO_URL="mongodb://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_DATABASE?authSource=admin"

# Backup directory
BACKUP_DIR="backup"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_PATH="$BACKUP_DIR/mongo_backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run mongodump to take a backup
mongodump --uri="$MONGO_URL" --out="$BACKUP_PATH"

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup successful! Backup saved to $BACKUP_PATH"
else
  echo "Backup failed!"
  exit 1
fi
