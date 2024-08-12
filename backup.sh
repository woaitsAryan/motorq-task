#!/bin/bash

MONGO_URL="mongodb://admin:95f4361fa62ea96283577d7ede1b9c3d43c1fb397f90e0feb1559916b97d57c1@localhost:27017/motorq-task?authSource=admin"

BACKUP_DIR="backup"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_PATH="$BACKUP_DIR/mongo_backup_$TIMESTAMP"

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGO_URL" --out="$BACKUP_PATH"

if [ $? -eq 0 ]; then
  echo "Backup successful! Backup saved to $BACKUP_PATH"
else
  echo "Backup failed!"
  exit 1
fi
