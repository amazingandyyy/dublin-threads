# 🍀 dublin-threads

Data API of developmenting projects and meetings for Dublin, CA

- Changelog of [Dublin Development Projects](https://dublin-development.icitywork.com/)
- Meeting of [Dublin Meetings Site]([https://dublin-development.icitywork.com/](https://dublin.ca.gov/1604/Meetings-Agendas-Minutes-Video-on-Demand))

### website

- https://dublin.amazyyy.com

### API

- list of all development projects (including those delisted): https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/snapshots/latest.json
- list of current public development projects: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/snapshots/latest.json
- development projects changelog: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/developments/logs/global.json
- list of past&upcoming meetings: https://raw.githubusercontent.com/amazingandyyy/dublin/main/docs/api/v2/meetings/all.json

## Architecture

- cronjob is defined as github actions, run scripts under `/worker`
  - [![archive web resources](https://github.com/amazingandyyy/dublin-threads/actions/workflows/archive-web-resources.yaml/badge.svg)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/archive-web-resources.yaml)
  - [![snapshot and generate JSON (developments)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-developements.yaml/badge.svg)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-developements.yaml)
  - [![snapshot and generate JSON (meetings)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-meetings.yaml/badge.svg)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-meetings.yaml)
- worker generates JSON api under `/docs/api`
  - [![generate api data from archives](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-api.yaml/badge.svg)](https://github.com/amazingandyyy/dublin-threads/actions/workflows/update-api.yaml)
- react webapp fetches from the api and serves the UI with the latest data
  - ![Vercel](https://vercelbadge.vercel.app/api/amazingandyyy/dublin)

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
