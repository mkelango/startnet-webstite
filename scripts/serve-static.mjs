import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..", "out");
const PORT = process.env.PORT || 3200;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".txt": "text/plain",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  let filePath = join(ROOT, path);

  try {
    let s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, "index.html");
    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    try {
      const data = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
