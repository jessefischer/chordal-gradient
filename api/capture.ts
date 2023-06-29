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
  const angleInDeg = JSON.parse(req.query['angleInDeg'] as string);
  const xPos = JSON.parse(req.query['xPos'] as string);
  const yPos = JSON.parse(req.query['yPos'] as string);

  const host = req.headers.host;

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  const notesString = JSON.stringify(notes);
  const url = `https://${host}/?notes=${encodeURIComponent(
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
