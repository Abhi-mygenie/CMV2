"""
Export all MongoDB collections to JSON files in /app/db_export/.
Run: python3 scripts/db_export.py
"""
import json
import os
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "loyalty_app")
EXPORT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "db_export")


def json_serial(obj):
    """JSON serializer for objects not serializable by default."""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def export_db():
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    os.makedirs(EXPORT_DIR, exist_ok=True)

    collections = sorted(db.list_collection_names())
    metadata = {"exported_at": datetime.utcnow().isoformat(), "db_name": DB_NAME, "collections": {}}

    for name in collections:
        docs = list(db[name].find())
        # Strip _id from each doc to keep exports clean
        for doc in docs:
            doc.pop("_id", None)
        filepath = os.path.join(EXPORT_DIR, f"{name}.json")
        with open(filepath, "w") as f:
            json.dump(docs, f, indent=2, default=json_serial)
        metadata["collections"][name] = len(docs)
        print(f"  Exported {name}: {len(docs)} docs")

    with open(os.path.join(EXPORT_DIR, "_export_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nExport complete -> {EXPORT_DIR}")
    client.close()


if __name__ == "__main__":
    export_db()
