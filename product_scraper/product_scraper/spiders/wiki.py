import scrapy
from product_scraper.items import ProductScraperItem


class WikiSpider(scrapy.Spider):
    name = "wiki"
    allowed_domains = ["wiki.tn"]
    start_urls = ["https://wiki.tn/"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        {
                            "method": "wait_for_selector",
                            "args": ["ul.categories-menu"],
                        }
                    ],
                },
                callback=self.parse_categories,
            )

    def parse_categories(self, response):
        categories = response.css("ul.categories-menu li.menu-item h6 a::attr(href)").getall()

        for category in categories:
            yield response.follow(
                category.strip(),
                callback=self.parse_pages,
                meta={"playwright": True},
            )

    def parse_pages(self, response):
        page_numbers = response.css("ul.wpgb-pagination li a::text").getall()

        pages = [int(p) for p in page_numbers if p.strip().isdigit()]
        last_page = max(pages) if pages else 1

        for page in range(1, last_page + 1):
            url = response.url if page == 1 else f"{response.url}?_pagination={page}"

            yield response.follow(
                url,
                callback=self.parse_products,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        {
                            "method": "wait_for_selector",
                            "args": ["div.brxe-block.product-top__inner-container"],
                        }
                    ],
                },
            )

    def parse_products(self, response):
        cards = response.css("div.product-card--grid")
        for card in cards:
            link = card.css(
                "figure.product-card__image a::attr(href)"
            ).get()


            yield response.follow(
                response.urljoin(link),
                callback=self.parse_product,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        {
                            "method": "wait_for_selector",
                            "args": ["div.product-card--grid"],
                        }
                    ],
                },
            )

    def parse_product(self, response):
        item = ProductScraperItem()
        
        item['url'] = response.url
        item['name'] = response.css('h1.brxe-product-title::text').get()
        item['sku'] = response.css('div.brxe-accordion-nested.product-top__accordion span.sku::text').get()
        item['brand'] = response.css(
            'tr.woocommerce-product-attributes-item--attribute_pa_brand '
            'td.woocommerce-product-attributes-item__value ::text'
        ).get(default='').strip()
        item['categories'] = response.css('div.product__breadcrumbs nav span.navigation a::text').getall()
        item['regular_price'] = (
            response.css('div.brxe-block.product-top__inner-container-info p.price del bdi::text').get()
            or response.css('div.brxe-block.product-top__inner-container-info p.price bdi::text').get()
        )
        item['current_price'] = (
            response.css('div.brxe-block.product-top__inner-container-info p.price ins bdi::text').get()
            or response.css('div.brxe-block.product-top__inner-container-info p.price bdi::text').get()
        )

        if item['regular_price']:
            item['regular_price'] = (
                item['regular_price']
                .replace('\xa0', '')
                .replace('TND', '')
                .strip()
            )

        if item['current_price']:
            item['current_price'] = (
                item['current_price']
                .replace('\xa0', '')
                .replace('TND', '')
                .strip()
            )

        item['discount'] = 0

        if item.get('regular_price') and item.get('current_price'):
            try:
                regular = float(item['regular_price'].replace(' ', '').replace(',', '.'))
                current = float(item['current_price'].replace(' ', '').replace(',', '.'))

                if regular > current:
                    item['discount'] = round(((regular - current) / regular) * 100, 2)
            except ValueError:
                item['discount'] = 0
                
        availability = response.css('div.stock-status-badge::text, p.stock.in-stock::text').get()
        item['availability'] = availability.strip() if availability else None

        item['description'] = " ".join(
            text.strip()
            for text in response.css(
                'div.woocommerce-product-details__short-description *::text'
            ).getall()
            if text.strip()
        )

        item['features'] = {
            row.css('th.woocommerce-product-attributes-item__label::text').get().strip():
            " ".join(row.css('td.woocommerce-product-attributes-item__value ::text').getall()).strip()
            for row in response.css(
                'table.woocommerce-product-attributes tr.woocommerce-product-attributes-item'
            )
        }

        images = response.css('div.woocommerce-product-gallery__wrapper a::attr(href)').getall()
        item['images'] = images

        item['website'] = 'https://wiki.tn/'

        yield item



