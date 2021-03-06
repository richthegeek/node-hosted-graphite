// Generated by CoffeeScript 1.7.1
(function() {
  var HostedGraphite, debug;

  debug = require('debug')('hg');

  module.exports = HostedGraphite = (function() {
    function HostedGraphite(options) {
      var dgram, _base, _base1, _base2;
      this.options = options;
      if (!options.account) {
        throw new Error('HostedGraphite required an account in the options hash');
      }
      if (options.prefix) {
        this.options.prefix = this.options.account + '.' + options.prefix;
      } else {
        this.options.prefix = this.options.account;
      }
      if ((_base = this.options).server == null) {
        _base.server = 'carbon.hostedgraphite.com';
      }
      if ((_base1 = this.options).port == null) {
        _base1.port = 2003;
      }
      if ((_base2 = this.options).sanitize == null) {
        _base2.sanitize = function(key) {
          return key.replace(/[^a-z0-9\._-]/ig, '_');
        };
      }
      debug('Init', this.options);
      dgram = require('dgram');
      this.socket = dgram.createSocket("udp4");
    }

    HostedGraphite.prototype.send = function(key, value) {
      var message;
      if (value == null) {
        value = 1;
      }
      if (Array.isArray(key)) {
        key = key.join('.');
      }
      key = this.options.prefix + '.' + this.options.sanitize(key);
      message = new Buffer("" + key + " " + value + "\n");
      return this.socket.send(message, 0, message.length, this.options.port, this.options.server, function() {
        return debug('Sending:', message.toString(), arguments);
      });
    };

    HostedGraphite.prototype.increment = function(key, value) {
      return this.send(key, value);
    };

    HostedGraphite.prototype.timing = function(key, value) {
      return this.send(key, value);
    };

    return HostedGraphite;

  })();

}).call(this);
