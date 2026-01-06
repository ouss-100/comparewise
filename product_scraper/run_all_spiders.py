from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy import spiderloader

settings = get_project_settings()
process = CrawlerProcess(settings)

loader = spiderloader.SpiderLoader.from_settings(settings)
for spider_name in loader.list():
    settings.set("FEEDS", {
        f"{spider_name}.csv": {
            "format": "csv",
            "encoding": "utf-8",
            "overwrite": True,
        }
    })
    process.crawl(spider_name)

process.start()
