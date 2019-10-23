# frozen_string_literal: true

require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'sinatra/json'
require 'faraday'
require 'dotenv'
require 'json'

Dotenv.load

get '/' do
  erb :index
end

get '/api/reports' do
  client = Faraday.new(
      url: ENV['SERVER_URL'],
      headers: {
          :Authorization => "Bearer #{ENV['ACCESS_TOKEN']}"
      }
  )

  res = client.get('/api/v1/admin/reports', {
      resolved: true,
      target_account_id: ENV["TARGET_ACCOUNT_ID"]
  })

  reports = JSON.parse(res.body, symbolize_names: true)
  reports.map { |report|
    {
        reporter: {
            name: report[:account][:display_name] || report[:account][:username],
            acct: report[:account][:account][:acct],
            url: report[:account][:account][:url],
            avatar: report[:account][:account][:avatar_static],
        },
        comment: report[:comment],
        statuses: report[:statuses].map { |st|
          e = JSON.parse(client.get('/api/oembed.json', {url: st[:url], maxwidth: 400, maxheight: 400}).body, symbolize_names: true)
          st.merge({embed: e})
        },
    }
  }.to_json
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].message
end
