#!/usr/bin/env ruby

# Usage:
#
#   ruby ./converter.rb foo.csv bar.csv
#
# will create:
#   * ./outputs/json/foo.json 
#   * ./outputs/json/bar.json
#   * ./outputs/images/<lots of images>

require 'csv'
require 'json'

def output_dir
  "./outputs"
end

def images_dir
  "#{output_dir}/images"
end

def csv_files
  ARGV.select { |filename| filename.downcase.end_with?(".csv") }
end

def csv_options 
  { 
    headers: true,             # treat first row of CSV as a row of headers
    header_converters: :symbol # sanitize header strings to symbols to make nice hash keys
  }
end

def output_json_filename(input_filename)
  "#{output_dir}/#{input_filename.downcase.sub('csv', 'json')}"
end

def output_img_path(level, header, id)
  "#{images_dir}/level-#{level}-#{header}-#{id}.png"
end

def write_to_file(data, file_path)
  File.open(file_path, 'wb') { |f| f.write(data) }
end

def khmer_headers
  [:question_1_kh, :question_2_kh, :correct_kh, :answer_kh]
end

def do_image_conversion(text, img_path)
  exit_status = system('phantomjs', 'convert-to-png.js', text, img_path)
  raise "Conversion failure: failed to convert '#{text}' into #{img_path}. phantomjs exited with #{exit_status}" unless exit_status 
end

csv_files.each do |csv_file|
  output = []

  CSV.foreach(csv_file, csv_options) do |row|
    level = row[:level]
    id = row[:id]

    khmer_headers.each do |header|
      khmer_text = row[header]

      if khmer_text.nil? or khmer_text.empty?
        puts "Skipping file:#{csv_file}, level:#{level}, column:#{header}, id:#{id} as text was missing or blank"
      else
        do_image_conversion(khmer_text, output_img_path(level, header, id))
      end
    end

    output << row.to_hash
  end

  write_to_file(output.to_json, output_json_filename(csv_file))
end 
