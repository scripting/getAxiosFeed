var myProductName = "getAxiosFeed", myVersion = "0.4.1";

const fs = require ("fs");
const utils = require ("daveutils"); 
const request = require ("request");

const config = {
	feeds: [
		{
			feedUrl: "http://api.axios.com/feed/",
			localPath: "/Users/davewiner/publicFolder/feedland/feeds/axios.xml"
			}
		],
	ctMinutesBetwReads: 10,
	productName: "getAxiosFeed", 
	version: "0.4.0"
	}
function httpReadUrl (url, callback) { //8/21/22 by DW
	var theRequest = {
		url: url, 
		headers: {
			"User-Agent": myProductName + " v" + myVersion
			}
		};
	request (theRequest, function (err, response, data) {
		if (err) {
			callback (err);
			}
		else {
			if (response.statusCode != 200) {
				const errstruct = {
					message: "Can't read the URL, \"" + url + "\" because we received a status code of " + response.statusCode + ".",
					statusCode: response.statusCode
					};
				callback (errstruct);
				}
			else {
				callback (undefined, data);
				}
			}
		});
	}
function updateFeed (theFeed) {
	const whenstart = new Date ();
	httpReadUrl (theFeed.feedUrl, function (err, xmltext) {
		if (err) {
			console.log (err.message);
			}
		else {
			fs.writeFile (theFeed.localPath, xmltext, function (err) {
				if (err) {
					console.log ("fs.writeFile: err.message == " + err.message);
					}
				else {
					console.log (whenstart.toLocaleTimeString () + ": " + config.productName + " v" + config.version + ", " + utils.secondsSince (whenstart) + " secs, theFeed.feedUrl == " + theFeed.feedUrl);
					}
				});
			}
		});
	}
function updateAllFeeds () {
	console.log ("");
	config.feeds.forEach (function (item) { //update each feed at start
		updateFeed (item);
		});
	}
function everyMinute () {
	var now = new Date ();
	if ((now.getMinutes () % config.ctMinutesBetwReads) == 0) {
		updateAllFeeds ();
		}
	}
updateAllFeeds ();
utils.runEveryMinute (everyMinute);
