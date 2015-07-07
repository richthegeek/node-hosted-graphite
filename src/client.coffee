debug = require('debug')('hg')

module.exports = class HostedGraphite

  constructor: (@options) ->
    if not options.account
      throw new Error 'HostedGraphite required an account in the options hash'

    if options.prefix
      @options.prefix = @options.account + '.' + options.prefix
    else
      @options.prefix = @options.account

    @options.server ?= 'carbon.hostedgraphite.com'
    @options.port ?= 2003

    debug('Init', @options)

    dgram = require 'dgram'
    @socket = dgram.createSocket("udp4")

  send: (key, value = 1) ->
    if Array.isArray key
      key = key.join '.'

    key = @options.prefix + '.' + key
    key = key.replace.replace(/[^a-z0-9\._]/ig, '_');

    message = new Buffer "#{key} #{value}\n"
    
    @socket.send message, 0, message.length, @options.port, @options.server, ->
      debug 'Sending:', message.toString(), arguments

  increment: (key, value) ->
    @send key, value
  
  timing: (key, value) ->
    @send key, value
