from product_scraper.items import ProductScraperItem
import scrapy
from scrapy_playwright.page import PageMethod


class MytekSpider(scrapy.Spider):
    name = "mytek"
    allowed_domains = ["www.mytek.tn"]
    start_urls = ["https://www.mytek.tn"]

    custom_settings = {
        "ROBOTSTXT_OBEY": False,
    }

    def parse(self, response):
        categories = response.css('li.rw-vertical-menu.all-category-wrapper')
        for li in categories:
            link = li.css('div.title_normal a::attr(href)').get()
            if link:
                yield scrapy.Request(
                    url=response.urljoin(link),
                    callback=self.parse_pages,
                    meta={
                        "playwright": True,
                        "playwright_page_methods": [
                            PageMethod("wait_for_selector", "div.d-flex.justify-content-center.col-lg-3")
                        ]
                    }
                )

    def parse_pages(self, response):
        yield from self.parse_products(response)

        page_links = response.css("ul.pagination li a::attr(href)").getall()
        for link in page_links:
            if link and link != response.url:
                yield scrapy.Request(
                    url=response.urljoin(link),
                    callback=self.parse_products,
                    meta={
                        "playwright": True,
                        "playwright_page_methods": [
                            PageMethod("wait_for_selector", "div.d-flex.justify-content-center.col-lg-3"),
                            PageMethod("wait_for_timeout", 5000),
                        ]
                    }
                )

    def parse_products(self, response):
        product_divs = response.css(
            "div.d-flex.justify-content-center.col-lg-3.col-md-4.col-sm-6.col-12.mb-4"
        )
        for div in product_divs:
            link = div.css("a::attr(href)").get()
            if link:
                yield scrapy.Request(
                    url=response.urljoin(link),
                    callback=self.parse_product,
                    meta={
                        "playwright": True,
                        "playwright_page_methods": [
                            PageMethod("wait_for_selector", "div.product-info-stock-sku"),
                            PageMethod("wait_for_timeout", 5000),
                        ]
                    }
                )

    def parse_product(self, response):
        item = ProductScraperItem()
        item['url'] = response.url
        item['name'] = response.css('div.page-title-wrapper.product h1.page-title span.base::text').get()
        item['sku'] = response.css('div.value[itemprop="sku"]::text').get()
        item['brand'] = response.css('div.product-info-stock-sku img::attr(alt)').get()
        item['categories'] = response.css('ul.items li[itemprop="itemListElement"] [itemprop="name"]::text').getall()
        item['current_price'] = response.css('div.product-info-price span.special-price span.price::text').get(default="0")
        item['regular_price'] = response.css('div.product-info-price span.old-price span.price::text').get(default="0")
        item['availability'] = response.css('div.product-info-stock-sku div.stock[itemprop="availability"] span::text').get()
        item['description'] = " ".join(response.css('div.product-info-main div.value[itemprop="description"] > p:first-child *::text').getall() or "")
        item['images'] = response.css('ul.product-images img::attr(data-image-large-src)').getall() or response.css('#gallery-container .carousel-inner img[itemprop="image"]::attr(src)').getall()
        item['website'] = "mytek"
        item['website_logo'] = "https://mk-media.mytek.tn/media/logo/stores/1/LOGO-MYTEK-176PX-INVERSE.png"
        item['features'] = {
            row.css('th::text').get(default='').strip(): row.css('td::text').get(default='').strip()
            for row in response.css('table#product-attribute-specs-table tbody tr')
        }

        yield item
