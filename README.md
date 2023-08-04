# 🍀 dublin-threads

Data API for Dublin, CA

## Changelog of [Dublin Development Projects](https://dublin-development.icitywork.com/)

### website

- https://dublin.amazyyy.com

### API

- list of all development projects (including those delisted): https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/snapshots/latest.json
- list of current public development projects: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/snapshots/latest.json
- development projects changelog: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/logs/global.json
- meetings: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/meeting/all.json

## Architecture

- cronjob is defined as github actions, run scripts under `/worker`
- worker generates JSON api under `/docs/api`
- react webapp fetches from the api and serves the UI with the latest data

## Special Thanks to

- [waybackpack](https://github.com/jsvine/waybackpack) for the archived webpages
- [recursive-diff](https://www.npmjs.com/package/recursive-diff) for the diffing of the JSON files
- [lodash](https://lodash.com/) for making searching for objects easier
- [zustand](https://github.com/pmndrs/zustand) for making state management easier
- [real-favicon-generator](https://realfavicongenerator.net/favicon_result) for generating favicons
- [VisGL](https://visgl.github.io/react-map-gl/docs/get-started) for the map

## Author

- [amazingandyyy](github.com/amazingandyyy)

## Other links

### citydocs

- https://citydocs.ci.dublin.ca.us/WebLink/Browse.aspx
- https://citydocs.dublin.ca.gov/WebLink/DocView.aspx?dbid=0&id=563268&page=1
