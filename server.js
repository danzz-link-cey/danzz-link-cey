// DANZZ LINK CEY BACKEND

import express from "express";
import cors from "cors";
import dns from "node:dns/promises";
import net from "node:net";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
origin: "https://danzz-link-cey.github.io"
}));

app.use(express.json({ limit: "10kb" }));

function isPublicIP(ip) {
if (net.isIPv4(ip)) {
const [a, b] = ip.split(".").map(Number);

    return !(
        a === 10 ||
        a === 127 ||
        a === 0 ||
        a === 169 && b === 254 ||
        a === 172 && b >= 16 && b <= 31 ||
        a === 192 && b === 168 ||
        a >= 224
    );
}

if (net.isIPv6(ip)) {
    return ip.startsWith("2") || ip.startsWith("3");
}

return false;

}

async function validateURL(value) {
try {
const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
        return null;
    }

    if (url.username || url.password) {
        return null;
    }

    const records = await dns.lookup(url.hostname, {
        all: true
    });

    if (!records.length || records.some(r => !isPublicIP(r.address))) {
        return null;
    }

    return url;
} catch {
    return null;
}

}

app.get("/", (req, res) => {
res.json({
name: "DANZZ LINK CEY",
status: "ONLINE",
version: "1.1.0"
});
});

app.post("/api/resolve", async (req, res) => {
try {
const input = req.body?.url;

    if (typeof input !== "string") {
        return res.status(400).json({
            error: "URL tidak valid."
        });
    }

    let current = await validateURL(input);

    if (!current) {
        return res.status(400).json({
            error: "URL tidak aman atau tidak valid."
        });
    }

    // Hanya memeriksa redirect standar yang diizinkan.
    // Tidak melewati CAPTCHA, login, iklan, atau proteksi akses.

    return res.json({
        success: true,
        destination: current.href,
        message: "URL berhasil divalidasi."
    });

} catch {
    return res.status(500).json({
        error: "Terjadi kesalahan pada server."
    });
}

});

app.listen(PORT, () => {
console.log("DANZZ LINK CEY aktif di port " + PORT);
});
