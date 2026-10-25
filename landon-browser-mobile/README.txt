LANDONL'S BROWSER MOBILE — PWA STARTER 0.1
==========================================

WHAT THIS IS
------------
This is a small mobile-friendly web app that can be added to an iPhone Home Screen
from Safari. It is deliberately kept separate from the existing Windows Electron
project, Render admin service, and Windows auto-updater.

It includes:
- A purple/black mobile start page with a search box
- Search provider choices (Google, Bing, DuckDuckGo)
- Quick-launch links
- Locally saved bookmarks
- A saved custom accent color
- A service worker for caching the start page

IMPORTANT LIMITATION
--------------------
This is an installable PWA/browser start-page companion, NOT a complete native iOS
browser. On iPhone, external searches and websites may open in Safari. A true native
browser app would be a separate iOS project using Apple's WebKit and requires an iOS
build/signing workflow. This starter does not change or deploy anything in the
existing Windows app or the existing Render admin panel.

PUBLISH FOR FREE USING GITHUB PAGES
-----------------------------------
1. Extract the ZIP.
2. Go to https://github.com/new and create a new repository named:
       landon-browser-mobile
   Use Public (these static files contain no secrets), and do not add a README or
   other files if GitHub offers that option.
3. Open the extracted folder named "landon-browser-mobile" on your PC. Select the
   CONTENTS inside that folder (index.html, styles.css, app.js, etc.), not the folder
   itself. Upload those contents to the ROOT of your new GitHub repository, then
   click Commit changes.
4. In that GitHub repository, click Settings > Pages.
5. Under Build and deployment, choose "Deploy from a branch".
6. Choose branch "main" and folder "/ (root)", then click Save.
7. Wait for GitHub Pages to publish the site. The expected address is:
       https://landon456.github.io/landon-browser-mobile/
   If GitHub displays a different URL, use the URL GitHub displays.

ADD IT TO YOUR IPHONE
---------------------
1. On your iPhone, open the site's HTTPS URL in Safari (not an in-app browser).
2. Tap Share.
3. Tap "Add to Home Screen". If needed, scroll down and choose Edit Actions to add
   that option.
4. Turn on "Open as Web App" if the switch appears.
5. Tap Add. The LandonL Browser icon will appear on your Home Screen.

CUSTOMIZE IT
------------
Open the app and tap the gear button to choose any accent color or search provider.
Tap + Add to save bookmarks. These settings are stored locally on that iPhone.

UPDATES
-------
To update the PWA, upload changed files to this separate GitHub repository and commit
changes. GitHub Pages will publish them. Close and reopen the Home Screen app if an
older cached copy appears.

KEEP THESE PROJECTS SEPARATE
----------------------------
Do NOT replace the files in the existing "landon-browser" Windows repository with
this PWA. Use the separate "landon-browser-mobile" repository so the existing
Windows app, Render admin panel, and auto-updater remain untouched.
