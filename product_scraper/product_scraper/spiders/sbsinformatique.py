import scrapy
from scrapy_playwright.page import PageMethod

class SbsinformatiqueSpider(scrapy.Spider):
    name = "sbsinformatique"
    allowed_domains = ["www.sbsinformatique.com"]
    start_urls = ["https://www.sbsinformatique.com"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        PageMethod("wait_for_selector", "div.block-categories")
                    ],
                    "playwright_include_page": True,
                },
                callback=self.parse
            )

    def parse(self, response):
        links = response.css(
            'div.block-categories ul.category-sub-menu li[data-depth="0"] > a::attr(href)'
        ).getall()

        for link in links:
            yield response.follow(
                link,
                meta={"playwright": True, "playwright_include_page": True},
                callback=self.parse_products
            )


    def parse_products(self, response):
        page = response.meta["playwright_page"]

        previous_count = 0
        while True:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.evaluate("() => new Promise(resolve => setTimeout(resolve, 2000))")
            products = response.css("div.products a::attr(href)").getall()
            current_count = len(products)

            if current_count == previous_count:
                break
            previous_count = current_count

        last_link = products[-1] if products else None
        if last_link:
            yield {"last_product_link": response.urljoin(last_link)}




    # def parse_products(self, response):
    #     page = response.meta.get("page", 1)

    #     products = response.css("div.products")
    #     if products:
    #         yield response.follow(
    #             response.url + f"?page={page + 1}",
    #             callback=self.parse_products,
    #             meta={"page": page + 1, "last_url": response.url},
    #         )
    #     else:
    #         last_url = response.meta.get("last_url")
    #         if last_url:
    #             yield {"page": page - 1, "url": last_url}




