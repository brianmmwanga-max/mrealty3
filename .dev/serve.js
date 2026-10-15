const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".jpg":"image/jpeg", ".png":"image/png", ".svg":"image/svg+xml", ".json":"application/json" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  // fake formspree endpoint for testing
  if (p.startsWith("/api/")) { res.writeHead(200, {"Content-Type":"application/json"}); return res.end('{"ok":true}'); }
  fs.readFile(file, (e, d) => {
    if (e) { res.writeHead(404); return res.end("not found: " + p); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(d);
  });
}).listen(8123, () => console.log("serving on 8123"));
