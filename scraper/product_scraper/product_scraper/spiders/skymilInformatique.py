import re
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
        item = ProductScraperItem()
        item['url'] = response.url
        item['name'] = response.css('h1.product-name::text').get(default="")
        item['sku'] = response.css('span[itemprop="sku"]::text').get(default="")

        brand_url = response.css('a[href*="/brand/"]::attr(href)').get()
        if brand_url:
            brand_slug = re.sub(r'.*/brand/\d+-', '', brand_url)
            item['brand'] = brand_slug.replace('-', ' ')
        else:
            item['brand'] = None
            

        item['categories'] = response.css('nav.breadcrumb li span[itemprop="name"]::text').getall()
        item['regular_price'] = response.css('div.product-discount span.regular-price::text').get(default="0")
        item['current_price'] = response.css('div.current-price span[itemprop="price"]::text').get(default="0")
        item['availability'] = " ".join(response.css('span#product-availability *::text').getall() or "")
        item['description'] = " ".join(response.css('div.product-short-description *::text').getall())
        item['images'] = response.css('ul.product-images img::attr(data-image-large-src)').getall()
        item['website'] = "skymil-informatique"
        item['website_logo'] = "https://skymil-informatique.com/img/skymil-logo-1650967213.jpg"

        item['features'] = {
            dt.css('::text').get().strip(): dd.css('::text').get().strip()
            for dt, dd in zip(
                response.css('section.product-features dt.name'),
                response.css('section.product-features dd.value')
            )
        }

        yield item
