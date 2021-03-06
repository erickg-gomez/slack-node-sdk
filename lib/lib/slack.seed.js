// Generated by CoffeeScript 1.9.0
var DEFAULT_MAX_ATTEMPTS, DEFAULT_TIMEOUT, Slack, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

request = require("requestretry");

DEFAULT_TIMEOUT = 10 * 1000;

DEFAULT_MAX_ATTEMPTS = 3;

Slack = (function() {
  function Slack(_at_token, _at_domain) {
    this.token = _at_token;
    this.domain = _at_domain;
    this.api = __bind(this.api, this);
    this.webhook = __bind(this.webhook, this);
    this.detectEmoji = __bind(this.detectEmoji, this);
    this.setWebhook = __bind(this.setWebhook, this);
    this.composeUrl = __bind(this.composeUrl, this);
    this.apiMode = this.domain == null;
    this.url = this.composeUrl();
    this.timeout = DEFAULT_TIMEOUT;
    this.maxAttempts = DEFAULT_MAX_ATTEMPTS;
  }

  Slack.prototype.composeUrl = function() {
    return "https://slack.com/api/";
  };

  Slack.prototype.setWebhook = function(url) {
    this.webhookUrl = url;
    return this;
  };

  Slack.prototype.detectEmoji = function(emoji) {
    var obj;
    obj = {};
    if (!emoji) {
      obj.key = "icon_emoji";
      obj.val = "";
      return obj;
    }
    obj.key = emoji.match(/^http/) ? "icon_url" : "icon_emoji";
    obj.val = emoji;
    return obj;
  };

  Slack.prototype.webhook = function(options, callback) {
    var emoji, payload;
    emoji = this.detectEmoji(options.icon_emoji);
    payload = {
      channel: options.channel,
      text: options.text,
      username: options.username,
      attachments: options.attachments
    };
    payload[emoji.key] = emoji.val;
    return request({
      method: "POST",
      url: this.webhookUrl,
      body: JSON.stringify(payload),
      timeout: this.timeout,
      maxAttempts: this.maxAttempts,
      retryDelay: 0
    }, function(err, body, response) {
      if (err != null) {
        return callback(err);
      }
      return callback(null, {
        status: err || response !== "ok" ? "fail" : "ok",
        statusCode: body.statusCode,
        headers: body.headers,
        response: response
      });
    });
  };

  Slack.prototype.api = function(method, options, callback) {
    var request_arg, url;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options.token = this.token;
    url = this.url + method;
    request_arg = {
      url: this.url + method,
      timeout: this.timeout,
      maxAttempts: this.maxAttempts,
      retryDelay: 0
    };
    if (this._is_post_api(method)) {
      request_arg.method = "POST";
      request_arg.form = options;
    } else {
      request_arg.method = "GET";
      request_arg.qs = options;
    }
    request(request_arg, function(err, body, response) {
      if (err) {
        return callback(err, {
          status: "fail",
          response: response
        });
      }
      if (typeof callback === "function") {
        callback(err, JSON.parse(response));
      }
    });
    return this;
  };

  Slack.prototype._is_post_api = function(method) {
    return method === "files.upload";
  };

  return Slack;

})();

module.exports = Slack;
