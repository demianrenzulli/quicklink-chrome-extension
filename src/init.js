 // Content-script that runs every time a new url is opened. 
 // Calls initQuicklink() to initialize and inject quicklink in the current page.
chrome.storage.sync.get(function(data) {
    initQuicklink(data);
});

/**
 * Initializes and injects quicklink in the current page.
 * @param {Object} data - the JSON object with the current user's settings
 */
function initQuicklink(data) {

    let ignoreUrlPaths = data.ignoreUrlPaths;
    let ignoreFileExtensions = data.ignoreFileExtensions;
    let ignoreUrlProtocols = data.ignoreUrlProtocols;
    let ignoreUrlPatterns = ignoreUrlPaths.concat(ignoreFileExtensions).concat(ignoreUrlProtocols);

    let ignoreElemAttributes = data.ignoreElemAttributes;

    quicklink.listen({
        //Allow all cross-origin requests for sites with multi-origin architectures (e.g. subdomains).
        origins: true,
        //Ignore url paths, extensions and attributes from user's settings.
        ignores: [
            uri => ignoreUrlPatterns.some(urlPattern => uri.toLowerCase().includes(urlPattern)),
            (uri, elem) => ignoreElemAttributes.some(elemAttr => elem.hasAttribute(elemAttr)),
            uri => uri.includes('#')
        ],
        //limit to 5 elements per page
        limit: 5
    });

    //send event to background script, for tracking purposes
    chrome.runtime.sendMessage({ msg: 'analytics', type: 'event', category: 'quicklink-library', action: 'init' });
}