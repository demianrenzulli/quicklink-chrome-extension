<p align="center">
	<img src="https://i.imgur.com/26TgOp6.png" width="640" alt="quicklink chrome extension">
</p>	

# Quicklink Chrome extension

> Injects [quicklink library](https://github.com/GoogleChromeLabs/quicklink) in sites, to achieve faster subsequent page-loads by prefetching in-viewport links during idle time.

# Why

This extension has two goals:

- Allowing users to navigate the web faster by prefetching in-viewport links.
- Allowing devellopers to test [quicklink](https://github.com/GoogleChromeLabs/quicklink) in their sites, and measure its impact, before implementing the library.

# Using the extension

- Download the code.
- Open Chrome and go to `chrome://extensions`.
- Click **Load Unpacked**.
- Select the `/src` directory, which contains the extension code.

## Testing the extension

- Open any site.
- Open DevTools and go to the **Network panel**.
- Make sure the **Initiator** and **Priority** column in DevTools are enabled (if not, right-click in the network panel to enable them).
- Observe in-viewport links being prefetched: they should appear as initiated by quicklink, and at the **Lowest** priority.
- Clicking on a prefetched link will show it as retrieved from the **prefetch cache** in the **Size** column.


# How it works

When the extension is installed, it will inject quicklink on every page the user visits.

## Configuration

The option menu can be accessed by clicking the extension icon, and choosing **Options**:

<img width="400px" height="240px" src="/options_menu.png">

The first option, allows to opt-out from Analytics, to stop sending tracking information:

<img src="/disable_tracking.png">

The second section allows to update the current [custom URL patterns](https://github.com/GoogleChromeLabs/quicklink#custom-ignore-patterns) to ignore and enter new ones:

<img src="/edit_settings.png">
