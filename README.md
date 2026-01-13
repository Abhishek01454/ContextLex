# ContextLex

A minimal Chrome extension that instantly displays word definitions when you double-click any word on any webpage.

## Overview

ContextLex is a lightweight, focused browser extension built with Manifest V3. It does one thing well: show you the meaning of words without leaving the page. No clutter, no settings, no distractions.

## Features

- **Instant Definitions**: Double-click any word to see its definition in a floating tooltip
- **Clean Design**: Minimal, non-intrusive UI that matches modern browser aesthetics
- **Dark Mode Support**: Automatically adapts to your system theme
- **Smart Positioning**: Tooltip stays within viewport bounds
- **Auto-Dismiss**: Closes when you click elsewhere, scroll, press Escape, or select another word
- **No Permissions Required**: Works without requesting unnecessary browser permissions

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** using the toggle in the top-right corner
4. Click **Load unpacked**
5. Select the `ContextLex` folder

### Updating

1. Pull the latest changes or re-download the repository
2. Go to `chrome://extensions/`
3. Click the refresh icon on the ContextLex card
4. Refresh any open tabs to reload the content script

## Usage

1. Navigate to any webpage
2. Double-click on a word you want to define
3. View the definition in the tooltip that appears
4. Click anywhere else, scroll, or press Escape to dismiss

## Supported Content

The extension works on most standard webpages including:

- Articles and blog posts
- Documentation sites
- News websites
- Forums and discussion boards

The extension does not work on:

- Chrome internal pages (chrome://)
- Chrome Web Store
- PDF documents opened in browser
- Local files (unless file access is enabled in extension settings)

## API

ContextLex uses the [Free Dictionary API](https://dictionaryapi.dev/) to fetch word definitions. This is a free, open-source API that requires no authentication.

## File Structure

```
ContextLex/
├── manifest.json    # Extension configuration (Manifest V3)
├── content.js       # Word detection and tooltip logic
├── styles.css       # Tooltip styling
└── README.md        # Documentation
```

## Technical Details

- **Manifest Version**: 3
- **Permissions**: None (uses content scripts with URL matching)
- **API**: Free Dictionary API (https://api.dictionaryapi.dev)
- **Browser Support**: Google Chrome (and Chromium-based browsers)

## Limitations

- English words only (based on the dictionary API)
- Requires an internet connection to fetch definitions
- Single-word lookups only (phrases are ignored)
- Some websites with strict Content Security Policies may block the API requests

## Privacy

ContextLex does not collect, store, or transmit any personal data. The only network requests made are to the Free Dictionary API to fetch word definitions. No analytics, tracking, or telemetry is included.

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.