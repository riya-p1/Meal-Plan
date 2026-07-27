import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  "/": read("index.html"),
  "/index.html": read("index.html"),
  "/styles.css": read("styles.css"),
  "/app.js": read("app.js"),
  "/README.md": read("README.md"),
  "/ATTRIBUTION.md": read("ATTRIBUTION.md"),
};

const worker = `const FILES = new Map(${JSON.stringify(Object.entries(files))});

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    if (pathname.endsWith("/")) pathname += "index.html";
    const body = FILES.get(pathname);

    if (!body) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(body, {
      headers: {
        "content-type": contentType(pathname),
        "cache-control": "no-store",
      },
    });
  },
};

function contentType(pathname) {
  const dot = pathname.lastIndexOf(".");
  const ext = dot === -1 ? ".html" : pathname.slice(dot);
  return TYPES[ext] || "text/plain; charset=utf-8";
}
`;

mkdirSync(resolve(root, "dist/server"), { recursive: true });
writeFileSync(resolve(root, "dist/server/index.js"), worker);

function read(file) {
  return readFileSync(resolve(root, file), "utf8");
}
