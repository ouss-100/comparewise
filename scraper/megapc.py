import scrapy
d

class MegapcSpider(scrapy.Spider):
    name = "megapc"
    allowed_domains = ["megapc.tn", "apiclt.gi-ga.tech"]
    start_urls = ["https://megapc.tn"]
    
    def parse(self, response):
        pass
        # category_links = response.css(
        # 'div.grid a.group.block::attr(href)'
        # ).getall()

        # if category_links:
        #     for link in category_links:
        #         yield response.follow(link, callback=self.parse)
        # else:
        #     # Leaf page (no more subcategories)
        #     yield {
        #        "link": response.url
        #     }

        
            
    # custom_settings = {
    #     'DOWNLOAD_HANDLERS': {
    #         "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    #         "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    #     },
    #     'TWISTED_REACTOR': "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
    # }

    # def start_requests(self):
    #     for url in self.start_urls:
    #         yield scrapy.Request(
    #             url,
    #             meta={
    #                 'playwright': True,
    #                 'playwright_page_methods': [
    #                     PageMethod('wait_for_selector', 'a.group.block', timeout=10000),
    #                 ],
    #             }
    #         )

    # def parse(self, response):
    #     self.logger.info(f"Parsing page: {response.url}")
        
    #     # Check for category links
    #     category_links = response.css('div.grid a.group.block::attr(href)').getall()

    #     if category_links:
    #         self.logger.info(f"Found {len(category_links)} category links on {response.url}")
    #         for link in category_links:
    #             yield scrapy.Request(
    #                 response.urljoin(link),
    #                 callback=self.parse,
    #                 meta={
    #                     'playwright': True,
    #                     'playwright_page_methods': [
    #                         PageMethod('wait_for_load_state', 'networkidle'),
    #                         PageMethod('wait_for_timeout', 2000),
    #                     ],
    #                 },
    #                 dont_filter=True
    #             )
        
    #     # Always check for products
    #     product_cards = response.css('article.product-card')
    #     self.logger.info(f"Looking for products on {response.url} - Found: {len(product_cards)}")
        
    #     if product_cards:
    #         self.logger.info(f"=== PRODUCTS FOUND! Extracting from {response.url} ===")
    #         yield from self.parse_products(response)
    #     else:
    #         # Debug output
    #         self.logger.warning(f"No product cards found on {response.url}")
    #         # Check if there are any article tags at all
    #         all_articles = response.css('article').getall()
    #         self.logger.warning(f"Total <article> tags found: {len(all_articles)}")
    #         if all_articles:
    #             self.logger.warning(f"First article class: {response.css('article::attr(class)').get()}")

    # def parse_products(self, response):
    #     # Extract product URLs from current page
    #     product_urls = response.css('article.product-card a::attr(href)').getall()
        
    #     self.logger.info(f"Extracting {len(product_urls)} product URLs from {response.url}")
        
    #     for url in product_urls:
    #         full_url = response.urljoin(url)
    #         yield {
    #             'product_url': full_url
    #         }
        
    #     # Check for pagination
    #     page_buttons = response.css('button[data-page]')
        
    #     if not page_buttons:
    #         self.logger.info(f"No pagination found on {response.url}")
    #         return
        
    #     page_numbers = page_buttons.css('::attr(data-page)').getall()
    #     self.logger.info(f"Found pagination with pages: {page_numbers}")
        
    #     if page_numbers:
    #         max_page = max([int(p) for p in page_numbers])
            
    #         # Extract category from URL
    #         url_path = response.url.replace('https://megapc.tn/shop/', '')
    #         path_parts = [p for p in url_path.split('/') if p]
            
    #         self.logger.info(f"Category path parts: {path_parts}")
            
    #         # Make API requests for remaining pages
    #         for page_num in range(1, max_page + 1):
    #             yield self.make_api_request(path_parts, page_num)

    # def make_api_request(self, path_parts, page_num):
    #     """Create API request for pagination"""
    #     api_url = "https://apiclt.gi-ga.tech/produit/byPaginationNew"
        
    #     # Try different payload structures
    #     # Structure 1: Simple page number
    #     payload = {
    #         'page': page_num,
    #     }
        
    #     # Add category if available
    #     if len(path_parts) >= 1:
    #         payload['categorie'] = path_parts[0]  # Try 'categorie' (French)
    #     if len(path_parts) >= 2:
    #         payload['sousCategorie'] = path_parts[1]  # Try 'sousCategorie'
        
    #     self.logger.info(f"API Request - Page {page_num}, Payload: {payload}")
        
    #     return scrapy.Request(
    #         api_url,
    #         method='POST',
    #         headers={
    #             'Content-Type': 'application/json',
    #             'Accept': 'application/json',
    #             'Origin': 'https://megapc.tn',
    #             'Referer': 'https://megapc.tn/',
    #         },
    #         body=json.dumps(payload),
    #         callback=self.parse_api_products,
    #         dont_filter=True,
    #         errback=self.errback_api
    #     )
    
    # def parse_api_products(self, response):
    #     """Parse API JSON response"""
    #     try:
    #         data = json.loads(response.text)
            
    #         self.logger.info(f"API Response status: {response.status}")
    #         self.logger.info(f"API Response keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            
    #         # Try different possible keys
    #         products = (
    #             data.get('produits') or 
    #             data.get('products') or 
    #             data.get('data') or 
    #             data.get('items') or 
    #             []
    #         )
            
    #         if not products and isinstance(data, list):
    #             products = data
            
    #         self.logger.info(f"Found {len(products)} products in API response")
            
    #         for product in products:
    #             # Try to build URL from different possible fields
    #             slug = (
    #                 product.get('slug') or 
    #                 product.get('url') or 
    #                 product.get('lien') or
    #                 product.get('titre', '').replace(' ', '-')
    #             )
                
    #             # Check if product has categorie/sousCategorie for URL building
    #             categorie = product.get('categorie') or product.get('category')
    #             sous_categorie = product.get('sousCategorie') or product.get('subcategory')
                
    #             if slug:
    #                 # Try to match the URL pattern from your HTML
    #                 if categorie and sous_categorie:
    #                     product_url = f"https://megapc.tn/shop/product/{categorie}/{sous_categorie}/{slug}"
    #                 elif categorie:
    #                     product_url = f"https://megapc.tn/shop/product/{categorie}/{slug}"
    #                 else:
    #                     product_url = f"https://megapc.tn/shop/product/{slug}"
                    
    #                 yield {
    #                     'product_url': product_url
    #                 }
    #             else:
    #                 self.logger.warning(f"Could not extract URL from product: {product}")
                    
    #     except json.JSONDecodeError as e:
    #         self.logger.error(f"Failed to parse JSON: {e}")
    #         self.logger.error(f"Response text: {response.text[:500]}")
    #     except Exception as e:
    #         self.logger.error(f"Error parsing API response: {e}")
    
    # def errback_api(self, failure):
    #     """Handle API request failures"""
    #     self.logger.error(f"API request failed: {failure.value}")





"""product details and it works correctly"""
"""
import re
import json
import scrapy
from collections import defaultdict
from product_scraper.items import ProductScraperItem
from scrapy_playwright.page import PageMethod

class MegapcSpider(scrapy.Spider):
    name = "megapc"
    allowed_domains = ["megapc.tn", "apiclt.gi-ga.tech"]
    start_urls = [
        "https://megapc.tn/shop/product/APPAREIL%20PHOTO%20&%20CAM%C3%89SCOPES/APPAREIL%20PHOTO/CANON-XA11-Camescope-Full-HD",
        "https://megapc.tn/shop/product/ORDINATEURS/PC%20GAMER/Config-Gamer-2026-Q1-Ryzen-3-3200G-Radeon-Vega-8-8GB-RAM-256GB-SSD",
        "https://megapc.tn/shop/product/Gigabyte-G27F-2-27-FHD-165-Mhz-IPS-1ms"
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_include_page": True,
                    "playwright_page_methods": [
                        # Click the "FICHE TECHNIQUE" tab if it exists
                        PageMethod("click", "button:has-text('FICHE TECHNIQUE')"),
                        # Wait a short time for content to load
                        PageMethod("wait_for_timeout", 1000)
                    ]
                },
                callback=self.parse_product
            )

    async def parse_product(self, response):
        page = response.meta["playwright_page"]
        item = ProductScraperItem()
        item['url'] = response.url
        item['name'] = response.css('h1.text-skin-base::text').get(default="").strip()

        # SKU
        sku_texts = response.xpath('//p[contains(., "Référence")]/text()').getall()
        item['sku'] = " ".join([t.strip() for t in sku_texts if t.strip() and "Référence" not in t])

        # Brand from JSON-LD
        json_ld = response.xpath('//script[@type="application/ld+json"]/text()').get()
        if json_ld:
            data = json.loads(json_ld)
            item['brand'] = data.get("brand", {}).get("name")

        # Categories
        item['categories'] = response.xpath('//div[contains(@class,"breadcrumb")]//ol/li/a/text()').getall()

        # Prices
        clean_price = lambda x: float(re.sub(r"[^\d]", "", x)) if x else None
        item["regular_price"] = clean_price(response.css('div.text-skin-primary del::text').get(default="").strip())
        item["current_price"] = clean_price(response.css('div.text-skin-primary span::text').get(default="").strip())

        # Availability
        badges = response.css('div.flex.flex-col span::text').getall()
        badges = [b.strip() for b in badges if b.strip()]
        item['availability'] = badges[4] if len(badges) > 4 else None


        # Description
        item['description'] = " ".join(response.css('div.innerhtml__specs *::text').getall()).strip()

        # Images
        item['images'] = [
            response.urljoin(src)
            for src in response.xpath('//img[contains(@src,"static.gi-ga.tech")]/@src').getall()
        ]

        # Website info
        item['website'] = "https://megapc.tn"
        item['website_logo'] = "https://megapc.tn/assets/images/mega.png"

        # Features: grab all tab panels instead of selected only
        features = defaultdict(list)
        panels = await page.query_selector_all('div[role="tabpanel"]')
        for panel in panels:
            rows = await panel.query_selector_all("div.flex.items-center.justify-between")
            for row in rows:
                key_elem = await row.query_selector("p.text-skin-muted")
                val_elem = await row.query_selector("p.text-skin-base")
                if key_elem and val_elem:
                    key = (await key_elem.inner_text()).strip()
                    val = (await val_elem.inner_text()).strip()
                    features[key].append(val)
        item['features'] = dict(features)

        await page.close()
        yield item


        """