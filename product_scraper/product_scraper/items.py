# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProductScraperItem(scrapy.Item):
    url = scrapy.Field()
    name = scrapy.Field()
    sku = scrapy.Field()
    brand = scrapy.Field()
    categories = scrapy.Field()
    regular_price = scrapy.Field()
    current_price = scrapy.Field()
    discount = scrapy.Field()
    availability = scrapy.Field()
    description = scrapy.Field()
    images = scrapy.Field()
    website = scrapy.Field()
    features = scrapy.Field()
