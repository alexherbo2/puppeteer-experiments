const puppeteer = require('puppeteer')
const fs = require('fs')

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const index = []

  await page.goto('https://developer.chrome.com/extensions/api_index')
  const pageURLs = await page.$$eval('main table:first-of-type tr td:first-child a', (links) => links.map((link) => link.href))
  for (const pageURL of pageURLs) {
    console.log(pageURL)
    await page.goto(pageURL)
    const api = await page.$eval('h1', (title) => title.textContent)
    const records = await page.evaluate((api) => {
      const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
      }
      const nodeList = document.querySelectorAll('table.api-summary tr td a')
      const records = Array.from(nodeList, (link) => {
        const name = link.textContent
        const type = capitalize(link.hash.match(/#([a-z]+)/)[1])
        const url = link.href
        const objectID = url
        return { objectID, name, type, api, url }
      })
      return records
    }, api)
    console.log(records)
    index.push(...records)
  }
  await fs.writeFile('index.json', JSON.stringify(index, undefined, 2), (error) => {})

  await browser.close()
}

main()
