/**
 * Reads configuration from config.json and saves it to local storage.
 * @param {Object} callback - function to execute when settings are saved successfully
 */
function initializeSettings(callback) {

    chrome.storage.sync.clear(function() {
        const url = chrome.runtime.getURL('data/config.json');

        fetch(url)
            .then((response) => response.json())
            .then((jsonConifg) => saveSettingsToLocalStorage(jsonConifg, callback));
    });
}

/**
 * Reads configuration from config.json and updates local storage with the new values.
 * @param {Object} localStorageJsonConfig - current settings in local storage
 */
function updateSettings(localStorageJsonConfig) {

    const url = chrome.runtime.getURL('data/config.json');

    fetch(url)
        .then((response) => response.json())
        .then((fileJsonConfig) => updateSettingsInLocalStorage(localStorageJsonConfig, fileJsonConfig));

}

/**
 * Saves json configuration to local storage.
 * @param {Object} jsonConfig - a JSON configuration object
 * @param {Object} callback - function to execute if settings are saved successfully
 */
function saveSettingsToLocalStorage(jsonConifg, callback) {
    chrome.storage.sync.set(jsonConifg, callback);
}

/**
 * Adds new config values (if any) to the existing configuration in local storage.
 * @param {Object} localStorageJsonConfig - current settings in local storage
 * @param {Object} fileJsonConfig - configuration in config.json
 */
function updateSettingsInLocalStorage(localStorageJsonConfig, fileJsonConfig) {

    localStorageJsonConfig.ignoreUrlPaths = getUpdatedField(localStorageJsonConfig.ignoreUrlPaths, fileJsonConfig.ignoreUrlPaths);
    localStorageJsonConfig.ignoreFileExtensions = getUpdatedField(localStorageJsonConfig.ignoreFileExtensions, fileJsonConfig.ignoreFileExtensions);
    localStorageJsonConfig.ignoreElemAttributes = getUpdatedField(localStorageJsonConfig.ignoreElemAttributes, fileJsonConfig.ignoreElemAttributes);
    localStorageJsonConfig.ignoreUrlProtocols = getUpdatedField(localStorageJsonConfig.ignoreUrlProtocols, fileJsonConfig.ignoreUrlProtocols);

    chrome.storage.sync.clear(function() {
        chrome.storage.sync.set(localStorageJsonConfig);
    });
}

/**
 * Adds the new values in config.json to the existing configuration in local storage.
 * @param {Object} localStorageField - current array for a given field in local storage
 * @param {Object} fileField - array for a given field in config.json
 */
function getUpdatedField(localStorageField, fileField) {
    let mergedArraysForField = localStorageField.concat(fileField);

    for (var i = 0; i < mergedArraysForField.length; ++i) {
        for (var j = i + 1; j < mergedArraysForField.length; ++j) {
            if (mergedArraysForField[i] === mergedArraysForField[j])
                mergedArraysForField.splice(j--, 1);
        }
    }

    return mergedArraysForField;
}

function sendAnalytics(trackingType, trackingCategory, trackingAction) {
    chrome.runtime.sendMessage({ msg: 'analytics', type: trackingType, category: trackingCategory, action: trackingAction });
}


/**
 * Parses the input field into an array of strings, without spaces and wihtout emtpy elements.
 * @param {Object} field - The string obtained for teh field in the input form.
 */
function parseInputField(field) {

    //remove whitespaces and transform comma separated string into array
    let parsedField = field.replace(/ /g, '').split(',');

    //remove empty elements
    return parsedField.filter(function(el) {
        return el != null && el != '';
    });
}