# Privacy Policy

**Last updated:** 2026-07-09

TabFlow is a Chrome extension that visualizes your browsing context by drawing
numeric badges on tab favicons. This document explains what data it accesses
and, more importantly, what it does not do with it.

## Data Collection

**TabFlow does not collect, transmit, or sell any data.** There is no
analytics, telemetry, tracking pixel, or remote server involved anywhere in
the extension. All logic runs locally in your browser.

## Data Stored Locally

TabFlow stores the following data using Chrome's built-in storage APIs,
entirely on your device:

| Data                           | Storage area             | Lifetime                                           |
| ------------------------------ | ------------------------ | -------------------------------------------------- |
| Recently activated tab IDs     | `chrome.storage.session` | Cleared automatically when the browser closes      |
| History size preference (3–10) | `chrome.storage.sync`    | Persists until changed or the extension is removed |

Tab IDs are internal Chrome identifiers, not URLs, page titles, or any other
content. If `chrome.storage.sync` is enabled in your Chrome profile, your
history size preference may sync across your own signed-in devices — this is
standard Chrome behavior for extension settings, not something TabFlow
initiates independently.

## Permissions

| Permission                           | Why it's needed                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `tabs`                               | To detect which tab you switch to (`chrome.tabs.onActivated`) and compute its position in your recent history |
| `storage`                            | To save/restore the history and your settings, as described above                                             |
| `host_permissions` (`http(s)://*/*`) | To read and redraw the favicon `<link>` element on the pages you visit — this is how the badge is drawn       |

The content script that draws badges only ever reads and writes a page's own
`<link rel="icon">` element. It does not read page content, form data,
cookies, or any other information from the pages you visit.

## Third Parties

TabFlow does not use any third-party services, SDKs, or analytics providers.
No data ever leaves your browser.

## Changes to This Policy

If this policy changes, the update will be reflected here with a new "Last
updated" date and, if applicable, a corresponding version bump of the
extension.

## Contact

Questions can be raised via [GitHub Issues](https://github.com/kayqfsr/TabFlow/issues).
