#!/usr/bin/env ruby

require 'optparse'
require 'json'
require 'fileutils'
require 'dotenv'
require 'digest/md5'

Dotenv.load # Load .env file

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: serper-search-hotels.rb [options]"

  opts.on("-l", "--location LOCATION", "Location to search for hotels (e.g., Zurich)") do |l|
    options[:location] = l
  end

  opts.on("-s", "--start-date DATE", "Check-in date (YYYY-MM-DD)") do |s|
    options[:check_in_date] = s
  end

  opts.on("-e", "--end-date DATE", "Check-out date (YYYY-MM-DD)") do |e|
    options[:check_out_date] = e
  end

  opts.on("-a", "--adults NUM", Integer, "Number of adults (default: 1)") do |a|
    options[:num_adults] = a
  end

  opts.on("-c", "--children NUM", Integer, "Number of children (default: 0)") do |c|
    options[:num_children] = c
  end

  opts.on("--api-key KEY", "Serper API Key (overrides .env)") do |k|
    options[:api_key] = k
  end

  opts.on("--cache-dir DIR", "Cache directory (default: ./.cache/serper_hotels)") do |d|
    options[:cache_dir] = d
  end

  opts.on_tail("-h", "--help", "Show this message") do
    puts opts
    exit
  end
end.parse!

# Default options
options[:num_adults] ||= 1
options[:num_children] ||= 0
options[:api_key] ||= ENV['SERPER_API_KEY']
options[:cache_dir] ||= File.join(File.dirname(__FILE__), '..', '.cache', 'serper_hotels')

unless options[:location] && options[:check_in_date] && options[:check_out_date]
  puts "Error: Missing required options. Please specify --location, --start-date, and --end-date."
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
cache_key_data = options.slice(:location, :check_in_date, :check_out_date, :num_adults, :num_children)
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
  engine: "google_hotels",
  q: options[:location],
  check_in_date: options[:check_in_date],
  check_out_date: options[:check_out_date],
  adults: options[:num_adults],
  children: options[:num_children]
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
