import scrapy
from product_scraper.items import ProductScraperItem


class ZoomSpider(scrapy.Spider):
    name = "zoom"
    allowed_domains = ["zoom.com.tn"]
    start_urls = ["https://zoom.com.tn/"]

    def parse(self, response):
        menu_items = response.css(
            "li.mm_menus_li.mm_menus_li_tab.sub-product.mm_sub_align_full.mm_has_sub "
            "span.mm_tab_toggle_title a::attr(href)"
        ).getall()

        for link in menu_items:
            yield response.follow(link, callback=self.parse_pages)

    def parse_pages(self, response):
        page_links = response.css("ul.page-list a::text").getall()

        if page_links:
            last_page = int(page_links[-2])
        else:
            last_page = 1

        for page in range(1, last_page + 1):
            url = response.url
            if page > 1:
                url = f"{response.url}?page={page}"

            yield response.follow(url, callback=self.parse_products)

    def parse_products(self, response):
        product_links = response.css(
            "div.product-miniature.js-product-miniature h5.product-name a::attr(href)"
        ).getall()

        for link in product_links:
            yield response.follow(link, callback=self.parse_product)

    def parse_product(self, response):
        item = ProductScraperItem()
        
        item['url'] = response.url
        item['website'] = "zoom.com.tn"
        item['categories'] = response.css('ol.breadcrumb li.breadcrumb-item a span::text').getall()
        #item['categories'] = response.css('nav.breadcrumb-wrapper ol.breadcrumb li.breadcrumb-item a span::text').getall()
        item['name'] = response.css('div.main-product-details.shadow-box.md-bottom.js-product-container h1.page-heading::text').get(default='').strip()
        item['sku'] = response.css('div.center-wrapper div.attribute-item.product-reference span::text').get(default='').strip()
        item['brand'] = response.css('div.center-wrapper div.attribute-item.product-manufacturer span::text').get(default='').strip()
        
        def parse_price(price_str):
            if price_str:
                price_clean = price_str.replace('DT','').replace('TND','').replace('\u202f','').replace(',','').strip()
                try:
                    return float(price_clean)
                except ValueError:
                    return None
            return None

        item['current_price'] = parse_price(response.css(
            'div.main-product-details.shadow-box.md-bottom.js-product-container p.current-price span::text'
        ).get())
        item['regular_price'] = parse_price(response.css(
            'div.main-product-details.shadow-box.md-bottom.js-product-container p.previous-price span.regular-price::text'
        ).get())

        if item['current_price'] and item['regular_price']:
            item['discount'] = f"{round((item['regular_price'] - item['current_price']) / item['regular_price'] * 100, 2)}%"
        else:
            item['discount'] = None

        availability_text = response.css('div.main-product-details.shadow-box.md-bottom.js-product-container span.product-availability::text').get()
        if availability_text:
            item['availability'] = availability_text.strip()
        else:
            item['availability'] = 'Unknown'
        
        item['description'] = ' '.join(
            response.css(
                'div.main-product-details.shadow-box.md-bottom.js-product-container div.product-description-short ::text'
            ).getall()
        ).strip()

        images = response.css('ul#js-zoom-gallery li.thumb-container a::attr(data-zoom-image)').getall()
        if not images:
            images = response.css('div.product-cover img::attr(src)').getall()
        item['images'] = images
        
        features = {}
        feature_rows = response.css('div.product-details .attribute-item')
        for row in feature_rows:
            key = row.css('label::text').get(default='').strip()
            value = row.css('span::text').get(default='').strip()
            if key and value:
                features[key] = value
        item['features'] = features
        
        yield item