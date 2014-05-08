# jSharey - A jQuery social sharing plugin

jSharey is a jQuery plugin that makes it easy to share your content via social channels with fully customizable markup.

With jSharey, you just need to add a couple data attributes to your markup, call the script on those elements and you're done. Style your "buttons" however you see fit with CSS - no more ugly button styles that don't fit your design.

## Usage

### Load the script
First, you must include jQuery library in your `<head>` or just before the close of your `<body>`. Then, include the jSharey plugin after the jQuery library.

'' <!-- Load jQuery -->
'' <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
'' <!-- Load jSharey plugin -->
'' <script src="jquery.apishare.js"></script>

### Add share info to markup
Next, you will need to go through your markup and add two data-attributes to each anchor tag you would like to share.

The first attribute is `data-share-channel` the value of which defines which social media channel to share on. Options include: `"facebook"`, `"twitter"`, and `"pinterest"`.

The second attribute is `data-share-info` the value of which contains a comma separated list of data to be sent to the share api. This data will vary depending on which channel you choose:

- Facebook: `"title, description, url, image, caption"`
- Twitter: `"text, url, via, hashtags"`
- Pinterest: `"page url, media url, description"`

**Note**: The values must be written in this order.

### Initialize the script
Finally, you need to initialize the script on the document ready event. Note: if you would like to use Facebook sharing you must register an app via their developer portal at [developers.facebook.com] and include the App ID when you initialize the plugin.

'' $(document).ready(funtion() \{
	'' $('[data-share-channel]').trackEvents({
	''     infoAttrName: 'share-info',
	''     channelAttrName: 'share-channel',
	''     fbAppID: '' // required for Facebook SDK
	'' });
'' });

All done. Now when a user clicks on your targeted link the content will be shared based on the data you provided in the data attributes.