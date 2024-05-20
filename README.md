# Home Assistant Card for Public Transport Victoria

A custom Home Assistant card for the Lovelace theme to show next available trains from a specific station .
To be used with the Home Assistant integration public_transport_victoria (https://github.com/bremor/public_transport_victoria)

[![License][license-shield]](LICENSE.md)

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

<!-- <a href="https://www.buymeacoffee.com/jedimeat" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>-->


![alt text](https://raw.githubusercontent.com/lkloeppel/home-assistant-public-transport-victoria-card/master/screenshot.png) 

Based on the community driven boilerplate of best practices for Home Assistant Lovelace custom cards (Boilerplate Card by [@iantrich](https://www.github.com/iantrich) https://github.com/custom-cards/boilerplate-card)

Inspiration and initial code from on  [@crismc](https://github.com/crismc/homeassistant_nationalrailtimes_lovelace)

## Options

| Name                 | Type    | Requirement  | Description                                            | Default             |
| ---------------------| ------- | ------------ | -------------------------------------------------------| ------------------- |
| type                 | string  | **Required** | `custom:public-transport-victoria-card`                |                     |
| entity               | string  | **Required** | Home Assistant entity ID.                              |                     |
| name                 | string  | **Optional** | Card title                                             | `none`              |
| show_status          | string  | **Optional** | Show service status (e.g. On Time, Delayed etc)        | `true`              |
| show_last_updated    | string  | **Optional** | Show when the service last communicated with the AP    | `true`              |
| show_next_services   | string  | **Optional** | Show the preview of the next services                  | `true`              |

## Install via HACS

The easiest way to install this frontend card is to install via HACS:

1) Simply go to HACS in your Home Assistant
2) Select 'Frontend'
3) In the top right of the screen, select the 3 dots and choose 'Custom repositories'
4) For the repository field enter 'https://github.com/lkloeppel/home-assistant-public-transport-victoria-card'
5) Choose 'Lovelace' as the category
6) Add
7) Restart your HomeAssistant
8) Explore & Download Repositories (depending on your version of Home Assistant)
9) Search for 'Public Transport Victoria'
10) Enjoy

## Installing the card from source

### Step 1

Clone the repository to your machine

### Step 2

Install necessary modules (verified to work in node 8.x)
`yarn install`

### Step 3

Do a test lint & build on the project. You can see available scripts in the package.json
`yarn build`

### Step 4

Copy content of <project_dir>/dist to your Home Assistant instance <config>/www/public-transport-victoria-card
If directories do not exist, create them.

### Step 5
Go to Settings > Dashboards, click the three dots menu in the top right and select Resources.
If you do not have the three dots, you will need to temporarily enable "Advanced Mode" within Profile

### Step 6
Choose "Add Resource" and enter the following:
   URL: /local/public-transport-victoria/card.js
   Resource Type: JavaScript Module

### Step 7
If you created the <config>/www directory, restart Home Assistant (Developer Tools > Restart)

<!-- Badges -->
[license-shield]: https://img.shields.io/github/license/custom-cards/boilerplate-card.svg?style=for-the-badge
[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/lkloeppel/home-assistant-public-transport-victoria-card?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/lkloeppel/home-assistant-public-transport-victoria-card/total?style=flat-square
[build-badge]: https://img.shields.io/github/workflow/status/crismc/home-assistant-public-transport-victoria-card/Build?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[ui-lovelace-minimalist]: https://ui-lovelace-minimalist.github.io/UI/
[release-url]: https://github.com/lkloeppel/home-assistant-public-transport-victoria-card/releases
