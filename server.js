const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const rootDir = __dirname;
const themeFilePath = process.env.THEME_FILE_PATH || path.join(rootDir, "contents", "theme.txt");

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8"
};

const sendJson = (res, statusCode, payload) => {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
};

const getSafePath = (requestPath) => {
    const normalizedPath = decodeURIComponent(requestPath.split("?")[0]);
    const relativePath = normalizedPath === "/" ? "index.html" : normalizedPath.replace(/^\/+/, "");
    const resolvedPath = path.resolve(rootDir, relativePath);

    if (!resolvedPath.startsWith(rootDir)) {
        return null;
    }

    return resolvedPath;
};

const serveStaticFile = (req, res) => {
    const filePath = getSafePath(req.url || "/");

    if (!filePath) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
    });
};

const appendThemeSuggestion = (theme) =>
    new Promise((resolve, reject) => {
        fs.mkdir(path.dirname(themeFilePath), { recursive: true }, (dirError) => {
            if (dirError) {
                reject(dirError);
                return;
            }

            fs.appendFile(themeFilePath, `${theme}\n`, "utf8", (appendError) => {
                if (appendError) {
                    reject(appendError);
                    return;
                }

                resolve();
            });
        });
    });

const collectRequestBody = (req) =>
    new Promise((resolve, reject) => {
        let rawBody = "";

        req.on("data", (chunk) => {
            rawBody += chunk;

            if (rawBody.length > 10_000) {
                reject(new Error("Request body too large."));
                req.destroy();
            }
        });

        req.on("end", () => resolve(rawBody));
        req.on("error", reject);
    });

const handleThemeSuggestion = async (req, res) => {
    try {
        const rawBody = await collectRequestBody(req);
        const parsedBody = JSON.parse(rawBody || "{}");
        const theme = typeof parsedBody.theme === "string" ? parsedBody.theme.trim() : "";

        if (!theme) {
            sendJson(res, 400, { error: "Theme is required." });
            return;
        }

        if (theme.length > 120) {
            sendJson(res, 400, { error: "Theme must be 120 characters or less." });
            return;
        }

        const normalizedTheme = theme.replace(/[\r\n]+/g, " ");
        await appendThemeSuggestion(normalizedTheme);
        sendJson(res, 200, { ok: true });
    } catch (error) {
        if (error instanceof SyntaxError) {
            sendJson(res, 400, { error: "Invalid JSON payload." });
            return;
        }

        console.error("Failed to append theme suggestion:", error);
        sendJson(res, 500, { error: "Unable to update theme.txt." });
    }
};

const createServer = () =>
    http.createServer((req, res) => {
        if (!req.url) {
            res.writeHead(400);
            res.end("Bad Request");
            return;
        }

        if (req.method === "POST" && req.url === "/api/theme-suggestions") {
            handleThemeSuggestion(req, res);
            return;
        }

        if (req.method === "GET" || req.method === "HEAD") {
            serveStaticFile(req, res);
            return;
        }

        res.writeHead(405);
        res.end("Method Not Allowed");
    });

if (require.main === module) {
    createServer().listen(port, host, () => {
        console.log(`Pixel Forge site running at http://${host}:${port}`);
        console.log(`Theme suggestions will be appended to ${themeFilePath}`);
    });
}

module.exports = { createServer };
