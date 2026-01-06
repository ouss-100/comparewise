import scrapy
from scrapy_playwright.page import PageMethod

class MegapcSpider(scrapy.Spider):
    name = "megapc"
    allowed_domains = ["megapc.tn"]
    start_urls = ["https://megapc.tn/shop/Nos-Categories"]
    visited_urls = set()  

    custom_settings = {
        "PLAYWRIGHT_BROWSER_TYPE": "chromium",
        "DOWNLOAD_HANDLERS": {
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
    }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        PageMethod("wait_for_selector", "a.group.block.w-full.shadow-card.p-3.rounded-md.bg-gray-50")
                    ]
                },
                callback=self.parse_links
            )

    def parse_links(self, response):
        links = response.css('a.group.block.w-full.shadow-card.p-3.rounded-md.bg-gray-50::attr(href)').getall()
        for link in links:
            absolute_url = response.urljoin(link)
            if absolute_url not in self.visited_urls:
                self.visited_urls.add(absolute_url)
                yield {"href": absolute_url}
                yield scrapy.Request(
                    absolute_url,
                    meta={
                        "playwright": True,
                        "playwright_page_methods": [
                            PageMethod("wait_for_selector", "a.group.block.w-full.shadow-card.p-3.rounded-md.bg-gray-50")
                        ]
                    },
                    callback=self.parse_links
                )
