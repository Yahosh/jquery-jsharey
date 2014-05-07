/*
 *  Project: jQuery API Share
 *  Description: Share content using social media apis and data attributes on in your markup
 *  Author: Josh Lawrence
 *  License: MIT
 */

;
(function($, window, document, undefined) {
	// Defaults
	var pluginName = 'apiShare',
		document = window.document,
		defaults = {
			dataShareInfo: 'share-info',
			fbAppID: ''
		};

	// Plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.api = $(this.element).data('share-api');
		this.shareInfo = this.getShareInfo();
		this.init();
	}

	Plugin.prototype.init = function() {
		var self = this;

		// on click trigger the appropriate share function
		$(this.element).on('click', function (e) {
			var url = self[self.api + 'Share'](self.shareInfo, self.options);

			if (url) {
				$(this).attr('href', url);
				console.log(e);
				return true;
			}

			return false;
		});
	};

	Plugin.prototype.getShareInfo = function() {
		// return an object with the share data
		var info,
			data = $(this.element).data(this.options.dataShareInfo).split(',');

		// Trim whitespace from data
		$.each(data, function (i) {
			data[i] = this.trim(data[i]);
		});

		switch (this.api) {
			case 'facebook':
				info = {
					title: data[0],
					description: data[1],
					url: data[2],
					image: data[3],
					caption: data[4]
				}
				break;

			case 'twitter':
				info = {
					text: data[0],
					url: data[1],
					via: data[2],
					hashtags: data[3]
				}
				break;

			default:
				break;
		}

		return info;
	};

	Plugin.prototype.facebookShare = function(data, options) {
		// check for fb sdk, if not present add to page
		if (!window.fbAsyncInit) {
			$('body').append('<div id="fb-root"></div>');

			// Asynchronously load fb jssdk
			var e = document.createElement('script');
			e.async = true;
			e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
			document.getElementById('fb-root').appendChild(e);

			// Initialize Facebook app
			window.fbAsyncInit = function() {
				FB.init({
					appId: options.fbAppID, // App ID from the App Dashboard
					status: false, // check the login status upon init?
					cookie: true, // set sessions cookies to allow your server to access the session?
					xfbml: true // parse XFBML tags on this page?
				});
				openDialog();
			};
		} else {
			openDialog();
		}

		function openDialog () {
			// Open Facebook share dialog
			FB.ui({
				method: 'feed',
				name: data.title,
				link: data.url,
				picture: data.image,
				caption: data.caption,
				description: data.description
			});
		}

		return false;
	};

	Plugin.prototype.twitterShare = function(data, options) {
		console.log('shared on twitter');

		// check if twitter sdk has been loaded, if not load it
		if (!window.twttr) {
			!function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (!d.getElementById(id)) {
					js = d.createElement(s);
					js.id = id;
					js.src = "https://platform.twitter.com/widgets.js";
					fjs.parentNode.insertBefore(js, fjs);
				}
			}(document, "script", "twitter-wjs");
		}

		var url = data.url,
			text = data.text,
			hashtags = data.hashtags,
			tweeturl = 'http://twitter.com/share?url=' + encodeURI(url) + '&text=' + text + '&hashtags=' + hashtags;

		return tweeturl;
	};

	// Define plugin
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}

}(jQuery, window, document));