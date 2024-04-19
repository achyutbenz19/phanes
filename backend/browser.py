from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from lxml import html
import re

class BrowserAutomation:
    def __init__(self):
        self.browser = None

    def open_browser(self, url="https://developers.google.com/"):
        if self.browser:
            self.browser.quit()
        options = Options()
        options.add_experimental_option("detach", True)
        self.browser = webdriver.Chrome(options=options)
        self.browser.get(url)
        return self.browser

    def navigate(self, url):
        self.browser.get(url)
        return self.browser

    def get_url(self):
        return self.browser.current_url

    def scrape(self):
        page_html = self.browser.page_source
        cleaned_html = self._trim_html(page_html)
        with open("output.html", "w", encoding="utf-8") as f:
            f.write(cleaned_html)
        return cleaned_html

    def scrape_by_id(self, ids):
        return [self.browser.find_element(By.ID, i).get_attribute("outerHTML") for i in ids]

    def scrape_by_xpath(self, xpaths):
        return [self.browser.find_element(By.XPATH, xpath).get_attribute("outerHTML") for xpath in xpaths]

    def extract_elements_by_xpath(self, html_string, xpath_selector):
        tree = html.fromstring(html_string)
        elements = tree.xpath(xpath_selector)
        return [html.tostring(element).decode("utf-8") for element in elements]

    def take_screenshot(self, path):
        self.browser.save_screenshot(path)

    def click(self, selector):
        try:
            self.browser.find_element(By.XPATH, selector).click()
        except Exception as e:
            print(f"Error in clicking: {e}")

    def type(self, selector, text):
        self.browser.find_element(By.XPATH, selector).send_keys(text)

    def _trim_html(self, html_string):
        return self._clean_html(self._clear_style_attributes(self._remove_non_content_tags(html_string)))

    def _remove_non_content_tags(self, html_string):
        non_content_tags = [
            "script", "style", "noscript", "br", "hr", "head", "link", "meta", "title",
            "iframe", "audio", "svg", "img"
        ]
        comments_pattern = r'<!--.*?-->'
        html_string = re.sub(comments_pattern, '', html_string, flags=re.DOTALL)
        pattern = r'<({0})\b[^>]*>(.*?)</\1>'.format('|'.join(non_content_tags))
        while re.search(pattern, html_string, re.DOTALL | re.IGNORECASE):
            html_string = re.sub(pattern, '', html_string, flags=re.DOTALL | re.IGNORECASE)
        self_closing_pattern = r'<({0})\b[^>]*/>'.format('|'.join(non_content_tags))
        return re.sub(self_closing_pattern, '', html_string, flags=re.IGNORECASE)

    def _clear_style_attributes(self, html_content):
        style_pattern = re.compile(r'\s*style\s*=\s*(".*?"|\'.*?\'|[^\'">\s]+)', re.IGNORECASE)
        return style_pattern.sub('', html_content)

    def _clean_html(self, html_content):
        html_content = re.sub(r'<!DOCTYPE html>', '', html_content, flags=re.IGNORECASE)
        html_content = re.sub(r'[\n\r\t]+', '', html_content)
        return re.sub(r'[ ]{2,}', '  ', html_content)
