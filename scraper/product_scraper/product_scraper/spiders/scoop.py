from product_scraper.items import ProductScraperItem
import scrapy
from scrapy.http import Request


class ScoopSpider(scrapy.Spider):
    name = "scoop"
    allowed_domains = ["www.scoop.com.tn"]
    start_urls = ["https://www.scoop.com.tn"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        {"method": "wait_for_selector", "args": ["ul.ul-column"]}
                    ],
                },
            )

    def parse(self, response):
        columns = response.css('ul.ul-column')

        for col in columns:
            items = col.css('li.tvmega-menu-link')

            current_header = None
            collected_lines = []

            for li in items:
                cls = li.attrib.get('class', '')

                if 'item-header' in cls:
                    if current_header:
                        targets = collected_lines or [current_header]

                        for el in targets:
                            name = el.css('a::text').get()
                            if name:
                                name = name.strip()
                            else:
                                name = el.css('img::attr(title)').get()
                                if name:
                                    name = name.strip()

                            href = el.css('a::attr(href)').get()
                            if href:
                                href = response.urljoin(href)

                            if name and href and "el-configurateur" not in href:
                                yield scrapy.Request(
                                    url=response.urljoin(href),
                                    callback=self.parse_pages,
                                    meta={"page": 1, "base_url": response.urljoin(href)}
                                )

                    current_header = li
                    collected_lines = []

                elif 'item-line' in cls:
                    collected_lines.append(li)

            if current_header:
                targets = collected_lines or [current_header]

                for el in targets:
                    name = el.css('a::text').get()
                    if name:
                        name = name.strip()
                    else:
                        name = el.css('img::attr(title)').get()
                        if name:
                            name = name.strip()

                    href = el.css('a::attr(href)').get()
                    if href:
                        href = response.urljoin(href)

                    if name and href and "el-configurateur" not in href:
                        yield scrapy.Request(
                            url=response.urljoin(href),
                            callback=self.parse_pages,
                            meta={"page": 1, "base_url": response.urljoin(href)}
                        )



    def parse_pages(self, response):
        page = response.meta.get("page", 1)
        base_url = response.meta.get("base_url")
        products = response.css("article.product-miniature.js-product-miniature")
        for product in products:
            product_url = product.css("a.thumbnail.product-thumbnail::attr(href)").get()
            yield response.follow(product_url, callback=self.parse_product)

        if products:
            next_page = page + 1
            next_url = f"{base_url}?page={next_page}"
            yield Request(
                url=next_url,
                callback=self.parse_pages,
                meta={"page": next_page, "base_url": base_url}
            )




    def parse_product(self, response):
        item = ProductScraperItem()
        item["url"] = response.url
        item["name"] = response.css('h1.h1[itemprop="name"]::text').get()
        item["sku"] = response.css('div.product-reference-haut span[itemprop="sku"]::text').get()
        item["brand"] = response.css('div.tvcms-product-brand-logo img::attr(alt)').get()
        item["categories"] = response.css('nav.breadcrumb li span[itemprop="name"]::text').getall()
        item["regular_price"] = response.css('div.product-discount span.regular-price::text').get(default="0")
        item["current_price"] = response.css('div.current-price span.price::text').get(default="0")
        item["availability"] = response.css('div.tv-product-page-content span#product-availability::text').get()
        item["description"] = " ".join(response.css('div.tv-product-page-content .tvproduct-page-decs *::text').getall() or "")
        item["images"] = response.css('div.col-md-6.tv-product-page-image img::attr(src)').getall()
        item["website"] = "scoop"
        item["website_logo"] = "https://www.scoop.com.tn/img/logo-1707140630.jpg"
        item["features"] = {
            n.strip(): v.strip()
            for n, v in zip(
                response.css('dl.data-sheet dt.name::text').getall(),
                response.css('dl.data-sheet dd.value::text').getall()
            )
        }

        yield item
