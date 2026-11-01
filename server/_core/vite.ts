import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientRoot = path.resolve(
        import.meta.dirname,
        "../..",
        "client"
      );
      let requestPath = new URL(req.originalUrl, "http://localhost").pathname;

      // Don't intercept static assets that didn't match Vite middlewares (e.g. 404 on missing CSS/JS/images)
      if (/\.(css|js|json|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|ico)$/i.test(requestPath)) {
        return next();
      }

      // Helper to resolve an HTML file from clientRoot or clientRoot/public
      const resolveHtml = (reqPath: string): string | null => {
        let clean = reqPath.replace(/\/$/, "");
        if (!clean || clean === "/index") clean = "/index.html";
        if (clean === "/programs") clean = "/programs.html";
        if (clean === "/departments") clean = "/departments.html";
        if (clean === "/dashboard" || clean.startsWith("/dashboard/") || clean === "/admin" || clean.startsWith("/admin/")) {
          const dashFile = path.resolve(clientRoot, "dashboard.html");
          if (fs.existsSync(dashFile)) return dashFile;
        }
        if (clean === "/news-details" || (clean.startsWith("/news/") && clean !== "/news.html")) {
          const newsDetailFile = path.resolve(clientRoot, "news-details.html");
          if (fs.existsSync(newsDetailFile)) return newsDetailFile;
        }

        const candidates = [
          clean,
          clean.endsWith(".html") ? clean : `${clean}.html`,
          `${clean}/index.html`,
        ];

        for (const cand of candidates) {
          const inClient = path.resolve(clientRoot, `.${cand}`);
          try {
            if (fs.existsSync(inClient) && fs.statSync(inClient).isFile()) {
              return inClient;
            }
          } catch {}
          const inPublic = path.resolve(clientRoot, "public", `.${cand}`);
          try {
            if (fs.existsSync(inPublic) && fs.statSync(inPublic).isFile()) {
              return inPublic;
            }
          } catch {}
        }
        return null;
      };

      const resolvedHtml = resolveHtml(requestPath);
      const clientTemplate = resolvedHtml || path.join(clientRoot, "index.html");

      // Reload the requested static page (or index fallback) from disk in case it changes.
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Normalization middleware for clean HTML routes in production
  app.use((req, res, next) => {
    let clean = req.path.replace(/\/$/, "");
    if (!clean || clean === "/index") clean = "/index.html";
    if (clean === "/programs") clean = "/programs.html";
    if (clean === "/departments") clean = "/departments.html";
    if (clean === "/dashboard" || clean.startsWith("/dashboard/") || clean === "/admin" || clean.startsWith("/admin/")) {
      const dashFile = path.resolve(distPath, "dashboard.html");
      if (fs.existsSync(dashFile)) return res.sendFile(dashFile);
    }
    if (clean === "/news-details" || (clean.startsWith("/news/") && clean !== "/news.html")) {
      const newsDetailFile = path.resolve(distPath, "news-details.html");
      if (fs.existsSync(newsDetailFile)) return res.sendFile(newsDetailFile);
    }

    const candidates = [
      clean,
      clean.endsWith(".html") ? clean : `${clean}.html`,
      `${clean}/index.html`,
    ];

    for (const cand of candidates) {
      const target = path.resolve(distPath, `.${cand}`);
      try {
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
          return res.sendFile(target);
        }
      } catch {}
    }
    next();
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
