import scrapy
from product_scraper.items import ProductScraperItem


class TunisianetSpider(scrapy.Spider):
    name = "tunisianet"
    allowed_domains = ["www.tunisianet.com.tn"]
    start_urls = ["https://www.tunisianet.com.tn"]

    def parse(self, response):
        links = response.css(
                'ul.menu-content.top-menu li.menu-item.item-header > a::attr(href)'
        ).getall()

        for link in links:
            yield response.follow(link, callback=self.parse_pages)

    def parse_pages(self, response):
        page_texts  = response.css("ul.page-list.clearfix li a::text").getall()
        pages = [int(p.strip()) for p in page_texts if p.strip().isdigit()]
        last_page = max(pages) if pages else 1

        for page in range(1, last_page + 1):
            url = response.url
            if page > 1:
                url = f"{response.url}?page={page}"

            yield response.follow(url, callback=self.parse_products)

    def parse_products(self, response):
        product_links = response.css(
            "article.product-miniature.js-product-miniature.col-xs-12.propadding a.thumbnail::attr(href)"
        ).getall()

        for link in product_links:
            yield response.follow(link, callback=self.parse_product)

    def parse_product(self, response):
        item = ProductScraperItem()

        item['url'] = response.url
        item['name'] = response.css(
            'h1[itemprop="name"]::text').get()
        item['sku'] = response.css('span[itemprop="sku"]::text').get()
        item['brand'] = response.css('.product-manufacturer img::attr(alt)').get()

        breadcrumbs = response.css('nav.breadcrumb ol li span[itemprop="name"]::text').getall()
        item['categories'] = breadcrumbs[1:-1] if breadcrumbs else []

        images = response.css('ul.product-images img::attr(data-image-large-src)').getall()

        main_image = response.css('img.js-qv-product-cover::attr(src)').get()

        if main_image and main_image not in images:
            images.insert(0, main_image)

        item['images'] = images
        item['current_price'] = response.css('.product-price [itemprop="price"]::attr(content)').get()
        item['regular_price'] = response.css('.product-discount .regular-price::text').get()
        item['availability'] = response.css('#stock_availability span::text').get()
        item['description'] = response.css('div[itemprop="description"]').get()
        item['website'] = "https://www.tunisianet.com.tn"

        features = {}
        feature_section = response.css('section.product-features:has(p.h6:contains("Fiche technique"))')

        if feature_section:
            names = feature_section.css('dt.name::text').getall()
            values = feature_section.css('dd.value::text').getall()

            for name, value in zip(names, values):
                features[name.strip()] = value.strip()

        item['features'] = features

        yield item




