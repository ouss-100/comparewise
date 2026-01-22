# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import re
import json
import pymongo
from itemadapter import ItemAdapter

class ProductScraperPipeline:
    
    BEFORE_LAST_SITES = {
        "mytek",
        "sbsinformatique",
        "scoop",
        "skymil-informatique",
    }

    LAST_SITES = {
        "tunisianet",
        "wiki",
        "zoom",
    }

    def __init__(self, mongo_uri=None, mongo_db=None):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI"),
            mongo_db=crawler.settings.get("MONGO_DATABASE", "products_db"),
        )

    def open_spider(self, spider):
        if self.mongo_uri:
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client[self.mongo_db]
            self.collection = self.db["products"]

    def close_spider(self, spider):
        if hasattr(self, "client"):
            self.client.close()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        # Helper function to clean price strings
        def clean_price(x):
            if x:
                digits = re.sub(r"[^\d]", "", str(x))
                return int(digits) if digits else 0
            return 0

        # Clean text fields and set default if missing
        for field in ["name", "sku", "brand", "description", "availability"]:
            adapter[field] = (adapter.get(field) or "Unknown").strip()

        # Handle categories based on site
        categories = adapter.get("categories")
        site = adapter.get("website", "").lower()

        if categories and isinstance(categories, list):
            values = [v.strip() for v in categories if v.strip()]
            if values:
                if site in self.BEFORE_LAST_SITES and len(values) >= 2:
                    adapter["categories"] = values[-2]
                else:
                    adapter["categories"] = values[-1]

        # Clean prices and calculate discount
        regular = clean_price(adapter.get("regular_price"))
        current = clean_price(adapter.get("current_price"))
        adapter["regular_price"] = regular
        adapter["current_price"] = current

        if regular > 0 and current < regular:
            adapter["discount"] = round(((regular - current) / regular) * 100, 2)
        else:
            adapter["discount"] = 0.0

        # Parse features if string
        features = adapter.get("features")
        if features and isinstance(features, str):
            try:
                adapter["features"] = json.loads(features.replace("'", '"'))
            except Exception as e:
                spider.logger.warning(f"Error parsing features: {e}")
                adapter["features"] = {}

        # Parse images if string
        images = adapter.get("images")
        if images and isinstance(images, str):
            adapter["images"] = [img.strip() for img in images.split(",") if img.strip()]

        # Save to MongoDB if connection exists
        if hasattr(self, "collection"):
            self.collection.update_one(
                {"sku": adapter.get("sku")},
                {"$set": dict(adapter)},
                upsert=True
            )

        return item  
