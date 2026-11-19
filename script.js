// DANZZ LINK CEY

const API_URL = "https://danzz-link-cey-production.up.railway.app";

const input = document.getElementById("linkInput");
const pasteBtn = document.getElementById("pasteBtn");
const resolveBtn = document.getElementById("resolveBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const error = document.getElementById("error");

const destination = document.getElementById("destination");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");

let finalLink = "";

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
    result.classList.add("hidden");
}

function validURL(value) {
    try {
        const url = new URL(value);

        return (
            (url.protocol === "https:" ||
             url.protocol === "http:") &&
            !url.username &&
            !url.password
        );
    } catch {
        return false;
    }
}

// Paste
pasteBtn.addEventListener("click", async () => {
    try {
        input.value = await navigator.clipboard.readText();
    } catch {
        showError("Silakan paste link secara manual.");
    }
});

// Proses URL
resolveBtn.addEventListener("click", async () => {
    const link = input.value.trim();

    result.classList.add("hidden");
    error.classList.add("hidden");

    if (!link || !validURL(link)) {
        showError("Masukkan URL HTTP atau HTTPS yang valid.");
        return;
    }

    loading.classList.remove("hidden");
    resolveBtn.disabled = true;

    try {
        const response = await fetch(
            `${API_URL}/api/resolve`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: link
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Gagal memproses URL.");
        }

        if (!validURL(data.destination)) {
            throw new Error("URL tujuan tidak valid.");
        }

        finalLink = data.destination;

        destination.textContent = finalLink;
        openBtn.href = finalLink;

        result.classList.remove("hidden");

    } catch (err) {
        showError(err.message || "Server tidak dapat dihubungi.");
    } finally {
        loading.classList.add("hidden");
        resolveBtn.disabled = false;
    }
});

// Salin URL
copyBtn.addEventListener("click", async () => {
    if (!finalLink) return;

    try {
        await navigator.clipboard.writeText(finalLink);
        copyBtn.textContent = "✓ BERHASIL DISALIN";
    } catch {
        showError("Gagal menyalin URL.");
    }
});
