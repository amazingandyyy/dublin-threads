const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const rdiff = require('recursive-diff');

const existingJson = require('../api/developments/latest.json')
const existingDiff = require('../api/developments/diff.json')

axios.get("https://dublin-development.icitywork.com")
  .then(res=>{
      // const input = fs.readFileSync(path.join(__dirname, '..','docs/index-2.html'))

      const input = res.data;
      const [data, diff] = build(input)
      // console.log(JSON.stringify(data, null, 2))
      const outputPath = path.join(__dirname, '../api/', 'developments/latest.json')
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
      
      const outputDiffPath = path.join(__dirname, '../api/', 'developments/diff.json')
      if(process.env.ENABLE_DIFF === 'true' && diff.length>0){
        fs.writeFileSync(outputDiffPath, JSON.stringify([...existingDiff, ...diff], null, 2))
      }
  })
  .catch(console.error)

const normalize = (str) => {
  return str.replace(/\s+/g, ' ').trim();
}

function build(HTML) {
  const $ = cheerio.load(HTML);
  const projectIDs = [];

  const detailsFns = {
    Applicant: (el) => {
      const i = $(el).find('.table-right').html().trim().split('<br>').map(normalize);
      let r = {}
      if (i.length === 3) {
        r = {
          name: i[0],
          address: i[1],
          phone: i[2]
        }
      } else {
        if (i[1].length > 15) {
          // is address
          r = {
            name: i[0],
            address: i[1],
            phone: 'n/a'
          }
        } else{
          r = {
            name: i[0],
            address: 'n/a',
            phone: i[1]
          }
        }
      }
      return r;
    },
    'Project Planner': (el) => {
      const i = $(el).find('.table-right').html().trim().split('<br>').map(normalize);
      return {
        name: i[0],
        phone: i[1],
        email: normalize($(el).find('.table-right').find('a').text()),
      }
    },
  }

  $('.modal.fade').each((i, el) => {
    projectIDs.push(el.attribs.id)
  })

  function parseGeo() {
    const data = {};
    $('script[type="text/javascript"]').each((index, element) => {
      const scriptContent = $(element).html();
      const latMatch = scriptContent.match(/var lat = (.*?);/);
      const lonMatch = scriptContent.match(/var lon = (.*?);/);
      const postidMatch = scriptContent.match(/var postid =(.*?);/);
      const iconNameMatch = scriptContent.match(/var iconName = "(.*?)";/);

      if (latMatch && lonMatch && postidMatch) {
        const lat = parseFloat(latMatch[1]);
        const lon = parseFloat(lonMatch[1]);
        const postid = parseInt(postidMatch[1]);
        const iconName = iconNameMatch[1];

        const item = {
          lat,
          lon,
          iconName,
        };
        data[`projectDetail${postid}`] = item //)
      }
    });

    return data
  }

  const geoLocations = parseGeo();
  const data = existingJson;
  const diff = [];
  projectIDs.forEach((id) => {
    $(`#${id}`).each((i, el) => {
      const d={};
      d.id = id;
      d.title = $(el).find('#myModalLabel').text();
      d.details = {}
      $(el).find('table').find('tr').each((i, el) => {
        const key = normalize($(el).find('.table-left').find('strong').text());
        const val = normalize($(el).find('.table-right').text());
        d.details[key] = val
        if(detailsFns[key] !== undefined) {
          d.details[key] = detailsFns[key](el)
        }
      })

      function findBlockByTitle(title) {
        return $(el).find('h4.dublin-green').filter((i, el) => $(el).text()===title)[0]
      }

      d.location = normalize(findBlockByTitle('Address')?.nextSibling.nodeValue);
      const docs = $(el).find('h4.dublin-green')[3];
      function cleanUpCityDocsUrl(url) {
        return url
          .replace('http://citydocs.ci.dublin.ca.us/', 'https://citydocs.dublin.ca.gov/')
          .replace('https://dublin-development.icitywork.com/', '')
          .replace('wp-content/', 'https://dublin-development.icitywork.com/wp-content/')
      }
      function cleanUpImagesUrl(url) {
        return url
          .replace('https://dublin-development.icitywork.com/', '')
          .replace('wp-content/', 'https://dublin-development.icitywork.com/wp-content/')
      }
      function traverseSiblings(el, acc=[]) {
        if ($(el).next().find('a').attr('href') !== undefined) {
          return traverseSiblings($(el).next(), [...acc, {
            name: normalize($(el).next().text()),
            url: cleanUpCityDocsUrl($(el).next().find('a').attr('href'))
          }])
        }else{
          return acc;
        }
      }
      d.docs = traverseSiblings(docs.nextSibling)
      d.status = $(findBlockByTitle('Status')).next().attr('alt');
      d.description = normalize($(findBlockByTitle('Project Description')).next().text());
      const images = findBlockByTitle('Project Images').nextSibling
      d.images = $(images).next().find('li').map((i, el) => ({
        original: cleanUpImagesUrl($(el).find('a').attr('href')),
        thumbnail: cleanUpImagesUrl($(el).find('img').attr('src'))
      })).get()

      d.geolocation = {
        lat: null, lon: null, iconName: 'dot', title: d.title,
        ...geoLocations[d.id]
      }

      if(data[d.id] !== undefined) {
        // it exists, find the diff and put the activity into the feed
        const localDiff = rdiff.getDiff(data[d.id], d, true)
        function cleanUpDiff(diff) {
          return diff.map(dif=>{
            return {
              ...dif,
              projectId: d.id,
              timestamp: Date.now(),
            }
          })
        }
        if(localDiff.length > 0) diff.push(...cleanUpDiff(localDiff))

        data[d.id] = d;
      }else{
        d.createdAt = new Date().toISOString().split('T')[0];
        data[d.id] = d;
      }
    })
  })
  return [data, diff];
}
