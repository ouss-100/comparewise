import scrapy
from product_scraper.items import ProductScraperItem



class SkymilinformatiqueSpider(scrapy.Spider):
    name = "skymilInformatique"
    allowed_domains = ["skymil-informatique.com"]
    start_urls = ["https://skymil-informatique.com"]

    def parse(self, response):
        links = response.css(
                'div.sp-verticalmenu-container ul.nav.navbar-nav.menu.sp_lesp.level-1 '
                'li.item-1.vertical-cat > a::attr(href)'
        ).getall()

        for link in links:
            yield response.follow(link, callback=self.parse_pages)

    def parse_pages(self, response):
        page_texts  = response.css("ul.page-list.clearfix.text-sm-center li a::text").getall()
        pages = [int(p.strip()) for p in page_texts if p.strip().isdigit()]
        last_page = max(pages) if pages else 1

        for page in range(1, last_page + 1):
            url = response.url
            if page > 1:
                url = f"{response.url}?page={page}"

            yield response.follow(url, callback=self.parse_products)

    def parse_products(self, response):
        product_links = response.css("article.js-product-miniature a.thumbnail::attr(href)").getall()

        for link in product_links:
            yield response.follow(link, callback=self.parse_product)

    def parse_product(self, response):
        images = response.css('ul.product-images img::attr(data-image-large-src)').getall()
        main_image = response.css('img.js-qv-product-cover::attr(src)').get()
        if main_image and main_image not in images:
            images.insert(0, main_image)

        regular_price = response.css('div.product-discount span.regular-price::text').get()
        if regular_price:
            regular_price = regular_price.replace('\xa0TND', '').replace(',', '').strip()

        current_price = response.css('div.current-price span[itemprop="price"]::attr(content)').get()
        discount = response.css('div.current-price span.discount-amount::text').get()
        if discount:
            discount = discount.replace('\xa0TND', '').replace('Économisez', '').strip()

        item = ProductScraperItem()
        item['url'] = response.url
        item['name'] = response.css('h1.product-name::text').get(default="").strip()
        item['sku'] = response.css('span[itemprop="sku"]::text').get()
        item['brand'] = response.css('a[href*="/brand/"] img::attr(src)').get()
        item['categories'] = response.css('nav.breadcrumb li span[itemprop="name"]::text').getall()
        item['regular_price'] = regular_price
        item['current_price'] = current_price
        item['discount'] = discount
        item['currency'] = response.css('meta[itemprop="priceCurrency"]::attr(content)').get()
        item['availability'] = response.css('#product-availability::text').get(default="").strip()
        item['description'] = response.css('div.product-short-description p::text').get(default="").strip()
        item['images'] = images
        item['website'] = "skymil-informatique.com"
        item['features'] = {
            dt.css('::text').get().strip(): dd.css('::text').get().strip()
            for dt, dd in zip(
                response.css('section.product-features dt.name'),
                response.css('section.product-features dd.value')
            )
        }

        yield item
