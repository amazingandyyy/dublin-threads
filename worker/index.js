const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const prefix = "DUBLIN"
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
          address: i[1]
        }
      } else{
        r = {
          name: i[0],
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

const $ = cheerio.load(fs.readFileSync(path.join(__dirname, '..','docs/index.html')));

const normalize = (str) => {
  return str.replace(/\s+/g, ' ').trim();
}

const projectIDs = [];
$('.modal.fade').each((i, el) => {
  projectIDs.push(el.attribs.id)
})

const data = [];
projectIDs.forEach((id) => {
  $(`#${id}`).each((i, el) => {
    const d={}
    d.title = $(el).find('#myModalLabel').text();
    d.details = {}
    $(el).find('table').find('tr').each((i, el) => {
      const key = normalize($(el).find('.table-left').find('strong').text());
      const val = normalize($(el).find('.table-right').text());
      d.details[key] = val
      if(detailsFns[key] !== undefined) {
        d.details[key] = detailsFns[key](el)
      }
      d.id = `${prefix}-${d.details["Planning Application #"]}`;
    })

    function findBlockByTitle(title) {
      return $(el).find('h4.dublin-green').filter((i, el) => $(el).text()===title)[0]
    }

    d.location = normalize(findBlockByTitle('Address')?.nextSibling.nodeValue);
    const docs = $(el).find('h4.dublin-green')[3];
    function cleanUpCityDocsUrl(url) {
      return url.replace('http://citydocs.ci.dublin.ca.us/', 'https://citydocs.dublin.ca.gov/')
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
      original: $(el).find('a').attr('href'),
      thumbnail: $(el).find('img').attr('src')
    })).get()
    data.push(d)
  })
})

console.log(JSON.stringify(data, null, 2))
fs.writeFileSync(path.join(__dirname, '..', 'data.json'), JSON.stringify(data, null, 2))