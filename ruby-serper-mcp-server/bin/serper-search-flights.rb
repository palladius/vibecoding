#!/usr/bin/env ruby

require 'optparse'
require 'json'
require 'fileutils'
require 'dotenv'
require 'digest/md5' # Added for MD5 hashing

Dotenv.load # Load .env file

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: serper-search-flights.rb [options]"

  opts.on("-f", "--from AIRPORT", "Departure airport IATA code (e.g., ZRH)") do |f|
    options[:from_airport] = f
  end

  opts.on("-t", "--to AIRPORT", "Arrival airport IATA code (e.g., BER)") do |t|
    options[:to_airport] = t
  end

  opts.on("-s", "--start-date DATE", "Departure date (YYYY-MM-DD)") do |s|
    options[:start_date] = s
  end

  opts.on("-e", "--end-date DATE", "Return date (YYYY-MM-DD, optional)") do |e|
    options[:end_date] = e
  end

  opts.on("-p", "--passengers NUM", Integer, "Number of passengers (default: 1)") do |p|
    options[:num_passengers] = p
  end

  opts.on("-c", "--class CLASS", "Travel class (e.g., economy, business, first)") do |c|
    options[:travel_class] = c
  end

  opts.on("--api-key KEY", "Serper API Key (overrides .env)") do |k|
    options[:api_key] = k
  end

  opts.on("--cache-dir DIR", "Cache directory (default: ./.cache/serper_flights)") do |d|
    options[:cache_dir] = d
  end

  opts.on_tail("-h", "--help", "Show this message") do
    puts opts
    exit
  end
end.parse!

# Default options
options[:num_passengers] ||= 1
options[:travel_class] ||= "economy"
options[:api_key] ||= ENV['SERPER_API_KEY']
options[:cache_dir] ||= File.join(File.dirname(__FILE__), '..', '.cache', 'serper_flights')

unless options[:from_airport] && options[:to_airport] && options[:start_date]
  puts "Error: Missing required options. Please specify --from, --to, and --start-date."
  puts OptionParser.new.help
  exit 1
end

unless options[:api_key]
  puts "Error: SERPER_API_KEY not found. Please set it in your .env file or provide it with --api-key."
  exit 1
end

# Ensure cache directory exists
FileUtils.mkdir_p(options[:cache_dir]) unless File.directory?(options[:cache_dir])

# Generate a unique cache key based on query parameters
cache_key_data = options.slice(:from_airport, :to_airport, :start_date, :end_date, :num_passengers, :travel_class)
cache_key = Digest::MD5.hexdigest(cache_key_data.to_json)
cache_file = File.join(options[:cache_dir], "#{cache_key}.json")

# Check cache first
if File.exist?(cache_file) && (Time.now - File.mtime(cache_file)) < (24 * 60 * 60) # 24 hours cache
  puts "Fetching from cache: #{cache_file}"
  puts File.read(cache_file)
  exit 0
end

# Build the SERPER API query
query_params = {
  engine: "google_flights",
  departure_id: options[:from_airport],
  arrival_id: options[:to_airport],
  outbound_date: options[:start_date],
  return_date: options[:end_date],
  adults: options[:num_passengers],
  travel_class: options[:travel_class]
}.compact

require 'uri'
require 'net/http'

uri = URI("https://serper.dev/search")
uri.query = URI.encode_www_form(query_params)

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Get.new(uri)
request["X-API-KEY"] = options[:api_key]
request["Content-Type"] = "application/json"

response = http.request(request)

if response.is_a?(Net::HTTPSuccess)
  puts "Fetching from SERPER API..."
  File.write(cache_file, response.body)
  puts response.body
else
  puts "Error: #{response.code} - #{response.message}"
  puts response.body
  exit 1
end