/** PAGE INITIALIZATION CODE AND VARIABLES **/

const ignoreUrlPathsInput = document.getElementById('ignore-url-paths');
const ignoreFileExtensionsInput = document.getElementById('ignore-file-extensions');
const ignoreElemAttributesInput = document.getElementById('ignore-element-attributes');
const ignoreUrlProtocolsInput = document.getElementById('ignore-url-protocols');
const optOutAnalyticsCheckbox = document.getElementById('opt-out-analytics');

let isGoogleAnalyticsEnabled = true;


// When save settings button is clicked, calls saveSettingsToLocalStorage() (defined in helpers.js)
// Passes a showMsg() callback to inform the user settings have been saved.
const saveSettingsBtn = document.getElementById('save-settings-btn');
saveSettingsBtn.onclick = function() {

    saveSettingsToLocalStorage({
        ignoreUrlPaths: parseInputField(ignoreUrlPathsInput.value),
        ignoreFileExtensions: parseInputField(ignoreFileExtensionsInput.value),
        ignoreElemAttributes: parseInputField(ignoreElemAttributesInput.value),
        ignoreUrlProtocols: parseInputField(ignoreUrlProtocolsInput.value)
    }, function() {
        showMsg("Settings saved");
        sendAnalytics('event', 'settings-page', 'save');
    });
}


// When save settings button is clicked, calls saveSettingsToLocalStorage() (defined in helpers.js).
// Passes a showMsg() callback.
const resetSettingsBtn = document.getElementById('reset-settings-btn');
resetSettingsBtn.onclick = function() {
    initializeSettings(function() {
        resetSettingsForm();
        sendAnalytics('event', 'settings-page', 'reset');
    });
}

optOutAnalyticsCheckbox.onchange = function() {
    chrome.storage.sync.set({
        googleAnalyticsEnabled: !optOutAnalyticsCheckbox.checked
    }, function() {
        // Inform user and reload extension to make opt-out change immediate.
        alert('You have opted ' + (optOutAnalyticsCheckbox.checked ? 'out' : 'in') + ' Google Analytics.\nThis window will close so the extension can be reloaded.');

        chrome.runtime.reload();
        window.close();
    });
}

// Initialize settings UI controls to its default values.
initializePage();



/** PAGE FUNCTIONS **/

/**
 * Initializes page components and scripts, including the main form, GA, etc.
 */
function initializePage() {
    initializeSettingsForm();
    sendAnalytics('pageview', 'options.html');
}

/**
 * Initializes user settings UI controls.
 * @param {Object} callback - function to execute when settings are initialized successfully.
 */
function initializeSettingsForm(callback) {

    chrome.storage.sync.get(function(result, callback) {

        ignoreUrlPathsInput.value = result.ignoreUrlPaths.join(', ');
        ignoreFileExtensionsInput.value = result.ignoreFileExtensions.join(', ');
        ignoreElemAttributesInput.value = result.ignoreElemAttributes.join(', ');
        ignoreUrlProtocolsInput.value = result.ignoreUrlProtocols.join(', ');
        optOutAnalyticsCheckbox.checked = !result.googleAnalyticsEnabled;

        if (callback) {
            callback();
        }
    });

}

/**
 * Called when settings are reset to defaults, to initialize the settings UI controls.
 */
function resetSettingsForm() {
    initializeSettingsForm(showMsg("Settings reset to defaults"));
}

/**
 * Shows a message for successful options operations.
 * @param {Object} msg - The text to show in the toast message.
 */
function showMsg(msg) {

    const optionsMsg = document.getElementsByClassName('options-msg')[0];
    optionsMsg.innerHTML = msg;
    optionsMsg.style.display = 'block';

}
