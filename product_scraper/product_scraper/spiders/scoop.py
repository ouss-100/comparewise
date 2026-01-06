import scrapy

class ScoopSpider(scrapy.Spider):
    name = "scoop"
    allowed_domains = ["www.scoop.com.tn"]
    start_urls = ["https://www.scoop.com.tn"]

    def parse(self, response):
        yield scrapy.Request(
            response.url,
            meta={
                "playwright": True,
                "playwright_page_methods": [
                    ("wait_for_selector", "ul.menu-content")
                ],
            },
            callback=self.parse_categories
        )

    def parse_categories(self, response):
        categories = response.css('ul.menu-content li.tvmega-menu-link.menu-item.item-header a::attr(href)').getall()
        for category in categories:
           yield response.follow(
                category.strip(),
                callback=self.parse_pages,
                meta={"playwright": True},
            )
               
    def parse_pages(self, base_url, page=1):
        url = f"{base_url}?page={page}"
        yield scrapy.Request(
            url,
            callback=self.parse_page_products,
            meta={
                "playwright": True,
                "playwright_page_methods": [
                    ("wait_for_selector", "div.brxe-block.product-top__inner-container")
                ],
                "page_number": page,
                "base_url": base_url,
            },
            dont_filter=True,
        )

    def parse_page_products(self, response):
        products_div = response.css("div.products")
        if products_div:
            yield {"page": response.meta["page_number"], "url": response.url}

            next_page = response.meta["page_number"] + 1
            base_url = response.meta["base_url"]
            yield from self.parse_pages(base_url, page=next_page)
        else:
            self.logger.info(f"No products found on page {response.meta['page_number']}")
