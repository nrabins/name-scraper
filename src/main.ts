import * as puppeteer from 'puppeteer';

import { IName, Name } from './Name';

const BASE_URL = 'https://www.behindthename.com';
const MAX_PAGE_COUNT = 100;

const nameDatas: IName[] = [];

async function scrape() {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let charIndex = 0; charIndex < 1; charIndex++) {
    const char = (charIndex + 10).toString(36);
    console.log(`Scanning character [${char}]`);
    let url = `${BASE_URL}/names/letter/${char}` as string | null;
    let pageCount = 0;

    while (url != null && pageCount < MAX_PAGE_COUNT) {
      pageCount++;
      console.log(`  Page ${pageCount}...`)
      await page.goto(url);

      const names = await page.$$eval('.listname', getInnerTexts);
      const genders = await page.$$eval('.listgender', getInnerTexts);
      const usages = await page.$$eval('.listusage', getInnerTexts);
      const fullTexts = await page.$$eval('.browsename', getInnerTexts);

      names.forEach((name, i) => {
        nameDatas.push( new Name(names[i], genders[i], usages[i], fullTexts[i]));
      })
      console.log(`    Scanned ${names.length} name(s)`)

      const nextUrl = await page.evaluate(() => {
        const hasMoreThanOnePage = document.getElementById('div_pagination') != null;
        const navElements = document.querySelectorAll('#div_pagination>nav>*');
        const nextPageEl = navElements[navElements.length - 1]
        const isLastPage = nextPageEl.classList.contains('pginval');

        if (hasMoreThanOnePage && !isLastPage) {
          return nextPageEl.getAttribute('href');
        } else {
          return null;
        }
      });

      const hasNext = nextUrl != null;
      url = hasNext ? `${BASE_URL}${nextUrl}` : null;
    }
  }

  await browser.close();
}

scrape();

const getInnerTexts = (els: Element[]) => {
  return els.map((el: HTMLElement) => el.innerText);
}
