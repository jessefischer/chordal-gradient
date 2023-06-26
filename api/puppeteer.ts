// api/run.js
import edgeChromium from 'chrome-aws-lambda'

// Importing Puppeteer core as default otherwise
// it won't function correctly with "launch()"
import puppeteer from 'puppeteer-core'

import { VercelResponse, VercelRequest } from "@vercel/node";

import { readFileSync } from 'fs';
import path from 'path';

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export default async function (_req: VercelRequest, res: VercelResponse) {
  // Edge executable will return an empty string locally.
  const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE
  
  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  })
  
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto('http://localhost:3000')
  await page.type('#root', 'a', {delay: 200})

  const element = await page.$('#backdrop');
  await element?.screenshot({path: 'temp123.png'});
  // await page.waitForTimeout(5000);

  const file = path.join(process.cwd(), 'temp123.png');
  const stringified = readFileSync(file);

  res.setHeader('Content-Type', 'image/x-png');
  res.setHeader('Content-Disposition', 'attachment; filename="test-2023-06-26.png');
  return res.end(stringified);
}