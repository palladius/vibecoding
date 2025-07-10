The Google Hotels API by SerpApi allows users to scrape hotel and vacation rental results from Google Hotels.[1] It is accessed via the `/search?engine=google_hotels` endpoint.[1]

Key parameters for querying the API include:
*   `q`: Defines the search query (e.g., "Bali Resorts").[1]
*   `gl`: Specifies the country (e.g., `us` for United States).[1]
*   `hl`: Specifies the language (e.g., `en` for English).[1]
*   `currency`: Sets the currency for prices (defaults to USD).[1]
*   `check_in_date` and `check_out_date`: Required parameters for the stay dates in YYYY-MM-DD format.[1]
*   `adults` and `children`: Define the number of adults and children.[1]
*   `children_ages`: Specifies the ages of children, separated by commas for multiple children.[1]

Advanced parameters allow for sorting (`sort_by`), price range filtering (`min_price`, `max_price`), property type inclusion (`property_types`), amenity filtering (`amenities`), and rating filtering (`rating`).[1] There are also specific filters for hotels (brands, hotel_class, free_cancellation, special_offers, eco_certified) and vacation rentals (vacation_rentals, bedrooms, bathrooms).[1] Pagination is supported using `next_page_token`.[1]

The API returns JSON output with structured data for properties and brands, including details like name, address, GPS coordinates, ratings, prices, and amenities.[1] It also provides examples for integrating with various programming languages like Ruby, Python, JavaScript, and cURL.[1]

Sources:
[1] Google Hotels API - SerpApi (https://serpapi.com/google-hotels-api)