
import unittest
import html
from urllib.parse import urlparse, parse_qs
import re
import sys
sys.path.append('.')
from utm_crawler import has_utm_params, get_b_number

class TestUtmCrawler(unittest.TestCase):

    def test_has_utm_params_with_amp_entity(self):
        url = "https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval#computation-based-metrics?utm_campaign=CDR_0xe875a906_default&amp;utm_medium=external&amp;utm_source=blog"
        self.assertTrue(has_utm_params(url), "URL with &amp; entity should be classified as having UTMs")

    def test_get_b_number_with_amp_entity(self):
        url = "https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval#computation-based-metrics?utm_campaign=CDR_0xe875a906_default&amp;utm_medium=external&amp;utm_source=blog"
        self.assertEqual(get_b_number(url), "e875a906", "Should correctly extract b-number from URL with &amp; entity")

    def test_has_utm_params_no_utm(self):
        url = "https://example.com/path/to/page"
        self.assertFalse(has_utm_params(url), "URL without UTMs should be classified as not having UTMs")

    def test_has_utm_params_with_utm(self):
        url = "https://example.com/path/to/page?utm_source=test&param=value"
        self.assertTrue(has_utm_params(url), "URL with UTMs should be classified as having UTMs")

    def test_get_b_number_no_b_number(self):
        url = "https://example.com/path/to/page?utm_source=test"
        self.assertIsNone(get_b_number(url), "Should return None if no b-number is present")

    def test_get_b_number_with_b_number(self):
        url = "https://example.com/path/to/page?utm_campaign=CDR_b12345_source&utm_medium=email"
        self.assertEqual(get_b_number(url), "12345", "Should correctly extract b-number")

if __name__ == '__main__':
    unittest.main()
