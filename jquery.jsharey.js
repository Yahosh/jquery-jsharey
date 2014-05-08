/*
 *  Project: jSharey - A jQuery social sharing plugin
 *  Description: Share content using social media apis and data attributes on in your markup
 *  Author: Josh Lawrence
 *  License: MIT
 */

;(function($, window, document, undefined) {
	// Defaults
	var pluginName = 'jsharey',
		defaults = {
			infoAttrName: 'share-info',
			channelAttrName: 'share-channel',
			fbAppID: ''
		};

	// Plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.shareChannel = $(this.element).data(this.options.channelAttrName);
		this.rawShareInfo = $(this.element).data(this.options.infoAttrName);
		this.shareInfo = this.getShareInfo();

		this.init();
	}

	Plugin.prototype.init = function() {
		var self = this;

		// on click trigger the appropriate share function
		$(this.element).on('click', function (e) {
			var url = self[self.shareChannel + 'Share'](self);

			if (url) {
				$(this).attr('href', url);
				return true;
			}

			return false;
		});
	};

	Plugin.prototype.getShareInfo = function() {
		// return an object with the share data
		var info,
			data = this.rawShareInfo.split(',');

		// Trim whitespace from data
		$.each(data, function (i) {
			data[i] = this.trim(data[i]);
		});

		switch (this.shareChannel) {
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

			case 'pinterest':
				info = {
					url: data[0],
					media: data[1],
					description: data[2]
				}
				break;

			default:
				break;
		}

		return info;
	};

	Plugin.prototype.facebookShare = function(data) {
		var options = data.options,
			info = data.shareInfo;

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
				name: info.title,
				link: info.url,
				picture: info.image,
				caption: info.caption,
				description: info.description
			});
		}

		return false;
	};

	Plugin.prototype.twitterShare = function(data) {
		var info = data.shareInfo,
			url = info.url,
			text = info.text,
			hashtags = info.hashtags,
			tweeturl = 'http://twitter.com/share?url=' + encodeURI(url) + '&text=' + text + '&hashtags=' + hashtags;

		return tweeturl;
	};

	Plugin.prototype.pinterestShare = function (data) {
		var info = data.shareInfo,
			url = info.url || document.location.href,
			media = info.media,
			description = info.description,
			pinurl = 'http://www.pinterest.com/pin/create/button/?url=' + encodeURI(url) + '&media=' + encodeURI(media) + '&description=' + description;

		return pinurl;
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