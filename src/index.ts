import puppeteer from 'puppeteer';

const categories = ['devtools.timeline'];

const url = 'https://google.com';

async function get(url: string): Promise<void> {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    await page.tracing.start();
    await page.goto(url);
    await page.tracing.stop();

    await browser.close();
}

const main = async () => get(url);

main();
