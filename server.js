// DANZZ LINK CEY BACKEND

import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: [
        "https://danzz-link-cey.github.io"
    ]
}));

app.use(express.json({ limit: "10kb" }));

const PORT = process.env.PORT || 3000;

// Status server
app.get("/", (req, res) => {
    res.json({
        name: "DANZZ LINK CEY",
        status: "ONLINE",
        version: "1.0.0"
    });
});

// Validasi URL
app.post("/api/resolve", (req, res) => {
    try {
        const value = req.body?.url;

        if (typeof value !== "string") {
            return res.status(400).json({
                error: "URL tidak valid."
            });
        }

        const url = new URL(value);

        if (
            !["http:", "https:"].includes(url.protocol) ||
            url.username ||
            url.password
        ) {
            return res.status(400).json({
                error: "Format URL tidak diizinkan."
            });
        }

        return res.json({
            success: true,
            destination: url.href
        });

    } catch {
        return res.status(400).json({
            error: "URL tidak valid."
        });
    }
});

app.listen(PORT, () => {
    console.log("DANZZ LINK CEY ONLINE PORT " + PORT);
});
