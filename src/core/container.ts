import juice from 'juice';
import * as mongoDb from 'mongodb';
import puppeteer, { Browser, executablePath, Page } from 'puppeteer';
import sanitizeHtml from 'sanitize-html';

export type Container = {
  browser: Browser;
};

let container: Container | null = null;

export async function getContainer() {
  if (container) {
    return container;
  }
  container = {
    browser: await puppeteer.launch(
      process.env.DEBUG
        ? {
            args: ['--disable-gpu', '--no-sandbox'],
            executablePath: executablePath(),
            headless: false,
          }
        : {
            args: ['--disable-gpu', '--headless', '--no-sandbox'],
            executablePath: '/usr/bin/google-chrome',
            headless: true,
          },
    ),
  };

  return container;
}

export async function getBrowserPage(
  browser: Browser,
  html: string | null,
  url: string | null,
  viewport: { height: number; width: number } = { height: 3508, width: 2480 },
): Promise<Page> {
  const page: Page = await browser.newPage();

  await page.setViewport(viewport);

  if (html) {
    const sanitzedHtml: string = sanitizeHtml(html, {
      allowedAttributes: false,
      allowedTags: false,
      exclusiveFilter: (element) => {
        // Remove iframe tag
        if (element.tag === 'iframe') {
          return true;
        }

        // Remove script tag
        if (element.tag === 'script') {
          return true;
        }

        // Remove img tag where src attribute is not a URL starting with http: or https:
        if (
          element.tag === 'img' &&
          element.attribs.src &&
          !element.attribs.src.startsWith('http:') &&
          !element.attribs.src.startsWith('https:')
        ) {
          return true;
        }

        return false;
      },
    });

    const inlinedHtml: string = juice(sanitzedHtml).replace(
      /<style>(.|\n)*?<\/style>/g,
      '',
    );

    await page.setContent(inlinedHtml, {
      timeout: 120000,
      waitUntil: 'networkidle0',
    });
  }

  if (url) {
    await page.goto(url, {
      timeout: 120000,
      waitUntil: 'networkidle0',
    });
  }

  return page;
}

export async function disposeContainer() {
  if (!container) {
    return;
  }

  await container.browser.close();

  container = null;
}
