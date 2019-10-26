let isGoogleAnalyticsEnabled;

/**
 * Runs on extension install. The first time it creates a new local config from config.json. 
 * In subsequent installations, it updates the local config wiht new values in config.json.
 */
chrome.runtime.onInstalled.addListener(function() {

    //TODO: This code should add the new values in config.js to the existing configuration in local storage.
    chrome.storage.sync.get(function(result) {

        //The first time the extension is installed, just initialize settings.
        if (JSON.stringify(result) === JSON.stringify({})) {
            initializeSettings();
        } else {
            updateSettings(result);
        }
    });
});

/**
 * Reads local configuration. If Google Analytics is enabled, it initializes it.
 */
chrome.storage.sync.get(function(result) {

    isGoogleAnalyticsEnabled = result.googleAnalyticsEnabled;

    if (isGoogleAnalyticsEnabled) {
        initGoogleAnalytics();
    }
});

/**
 * Centralizes tracking requests from different parts of the extension.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.msg == 'analytics' && isGoogleAnalyticsEnabled) {

        if (request.type == 'pageview') {
            ga('send', 'pageview', request.category);
        } else {
            ga('send', 'event', request.category, request.action);
        }
    }
});

/**
 * Initializes GA.
 */
function initGoogleAnalytics() {
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o), m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

    ga('create', 'UA-150949258-1', 'auto');
    ga('set', 'checkProtocolTask', function() {});
}