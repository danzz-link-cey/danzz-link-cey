// @ts-nocheck
// DANZZ LINK CEY BACKEND

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const PORT = process.env.PORT || 3000;

const allowedHosts = (
  process.env.ALLOWED_HOSTS || ""
)
  .split(",")
  .map(host => host.trim().toLowerCase())
  .filter(Boolean);

function isAllowed(hostname) {
  return allowedHosts.some(host =>
    hostname === host ||
    hostname.endsWith("." + host)
  );
}

function validateURL(value) {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    if (url.username || url.password) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

// API utama
app.get("/", (req, res) => {
  res.json({
    name: "DANZZ LINK CEY",
    status: "ONLINE",
    version: "1.0.0"
  });
});

// API pemrosesan redirect standar
app.post("/api/resolve", async (req, res) => {
  try {
    const input = req.body?.url;

    if (typeof input !== "string") {
      return res.status(400).json({
        error: "Link tidak valid."
      });
    }

    let current = validateURL(input);

    if (!current) {
      return res.status(400).json({
        error: "Format URL salah."
      });
    }

    if (!isAllowed(current.hostname)) {
      return res.status(403).json({
        error: "Domain belum didukung."
      });
    }

    for (let i = 0; i < 8; i++) {
      const response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(10000)
      });

      const location =
        response.headers.get("location");

      if (
        response.status >= 300 &&
        response.status < 400 &&
        location
      ) {
        const nextURL = validateURL(
          new URL(location, current).href
        );

        if (!nextURL) {
          throw new Error("Redirect tidak valid.");
        }

        if (!isAllowed(nextURL.hostname)) {
          return res.json({
            success: true,
            destination: nextURL.href
          });
        }

        current = nextURL;
        continue;
      }

      return res.json({
        success: true,
        destination: current.href
      });
    }

    throw new Error("Batas redirect tercapai.");

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Gagal memproses link."
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(
    "DANZZ LINK CEY berjalan di port " + PORT
  );
});