import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

import { VercelResponse, VercelRequest } from '@vercel/node';

import { readFileSync } from 'fs';
import path from 'path';

const LOCAL_CHROME_EXECUTABLE =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export default async function (req: VercelRequest, res: VercelResponse) {
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  const notes = JSON.parse(req.query['notes'] as string);
  const angleInDeg = req.query['angleInDeg'];
  const xPos = req.query['xPos'];
  const yPos = req.query['yPos'];

  const width = Number(req.query['width']);
  const height = Number(req.query['height']);

  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';

  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: 2
  });
  const notesString = JSON.stringify(notes);
  const url = `${protocol}://${host}/?notes=${encodeURIComponent(
    notesString
  )}&showUI=false&angleInDeg=${angleInDeg}&xPos=${xPos}&yPos=${yPos}`;
  await page.goto(url);
  await page.waitForTimeout(1000);

  const uuid = Math.floor(Math.random() * 100000);
  await page.screenshot({ path: `/tmp/rainbow-sounds-${uuid}.png` });
  const file = path.join(`/tmp/rainbow-sounds-${uuid}.png`);
  const stringified = readFileSync(file);

  res.setHeader('Content-Type', 'image/x-png');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="rainbow-sounds-${uuid}.png"`
  );
  return res.end(stringified);
}
