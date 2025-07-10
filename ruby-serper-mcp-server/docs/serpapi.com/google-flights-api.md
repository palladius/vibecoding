The content of the page "Google Flights API - SerpApi" describes the SerpApi Google Flights API, which allows users to scrape flight results from Google Flights[1]. The API endpoint is `/search?engine=google_flights` and can be accessed via a GET request[1].

The page details various API parameters, including:
*   **Search Query Parameters**: `departure_id` (departure airport code or location kgmid), `arrival_id` (arrival airport code or location kgmid)[1].
*   **Localization Parameters**: `gl` (country code), `hl` (language code), `currency` (currency of returned prices, defaults to USD)[1].
*   **Advanced Google Flights Parameters**: `type` (round trip, one way, multi-city), `outbound_date`, `return_date`, `travel_class`, `multi_city_json` (for multi-city flights), `show_hidden`, `deep_search` (for more precise results at increased response times)[1].
*   **Number of Passengers**: `adults`, `children`, `infants_in_seat`, `infants_on_lap`[1].
*   **Sorting**: `sort_by` (top flights, price, departure time, arrival time, duration, emissions)[1].
*   **Advanced Filters**: `stops`, `exclude_airlines`, `include_airlines`, `bags`, `max_price`, `outbound_times`, `return_times`, `emissions`, `layover_duration`, `exclude_conns`, `max_duration`[1].
*   **Next Flights**: `departure_token`[1].
*   **Booking Flights**: `booking_token`[1].
*   **Serpapi Parameters**: `engine` (must be `google_flights`), `no_cache`, `async`, `zero_trace`, `api_key`, `output` (json or html)[1].

The API returns JSON results with structured data for Flight Results and Price Insights, and also provides HTML results[1]. The page includes typical examples of API calls and JSON output[1].

Sources:
[1] Google Flights API - SerpApi (https://serpapi.com/google-flights-api)