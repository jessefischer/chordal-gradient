import { VercelResponse, VercelRequest } from "@vercel/node";

export default function handler(
  request,
  response,
) {
  response.status(200).json({
    body: "Hello, world!",
    query: request.query,
    cookies: request.cookies,
  });
}