import scrapy
from scrapy.http import Request
from product_scraper.items import ProductScraperItem


class SbsinformatiqueSpider(scrapy.Spider):
    name = "sbsinformatique"
    allowed_domains = ["sbsinformatique.com"]
    start_urls = ["https://www.sbsinformatique.com"]

    custom_settings = {
        "ROBOTSTXT_OBEY": False,
        "RETRY_TIMES": 3,
    }

    def parse(self, response):
        category_links = response.css(
            'div.block-categories ul.category-sub-menu li[data-depth="0"] > a::attr(href)'
        ).getall()
        for link in category_links:
            yield Request(
                url=link,
                callback=self.parse_category,
                meta={"page": 1, "base_url": link}
            )

    def parse_category(self, response):
        page = response.meta.get("page", 1)
        base_url = response.meta.get("base_url")
        products = response.css("article.product-miniature")
        for product in products:
            product_url = product.css("a.thumbnail.product-thumbnail::attr(href)").get()
            yield response.follow(product_url, callback=self.parse_product)

        if products:
            next_page = page + 1
            next_url = f"{base_url}?page={next_page}"
            yield Request(
                url=next_url,
                callback=self.parse_category,
                meta={"page": next_page, "base_url": base_url}
            )

    def parse_product(self, response):
        item = ProductScraperItem()
        item["url"] = response.url
        item["name"] = response.css('h1.h1[itemprop="name"]::text').get()
        item["sku"] = response.css('div.product-reference span[itemprop="sku"]::text').get()
        item["brand"] = response.css('div.tvcms-product-brand-logo img::attr(alt)').get()
        item["categories"] = response.css('nav.breadcrumb li span[itemprop="name"]::text').getall()
        item["regular_price"] = response.css('div.product-discount span.regular-price::text').get(default="0")
        item["current_price"] = response.css('div.current-price span.price::text').get(default="0")
        item["availability"] = response.css('div.tvcart-btn-model button span::text').get()
        item["description"] = " ".join(response.css('div.tvproduct-page-decs[itemprop="description"] *::text').getall() or "")
        item["images"] = response.css(".images-container img::attr(src)").getall()
        item["website"] = "sbsinformatique"
        item["website_logo"] = "https://www.sbsinformatique.com/img/logo-1708941066.jpg"
        item["features"] = {
            dt.css("::text").get(default="").strip(): dd.css("::text").get(default="").strip()
            for dt, dd in zip(
                response.css("div.product-features dl.data-sheet dt.name"),
                response.css("div.product-features dl.data-sheet dd.value")
            )
            if dt.css("::text").get() and dd.css("::text").get()
        }
        yield item
