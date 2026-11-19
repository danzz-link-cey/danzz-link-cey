// DANZZ LINK CEY

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

/**

* Menampilkan pesan error.
* @param {string} message
  */
  function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
  result.classList.add("hidden");
  }

// Tombol paste
pasteBtn.addEventListener("click", async () => {
try {
input.value = await navigator.clipboard.readText();
} catch {
showError("Tidak bisa membaca clipboard. Silakan paste manual.");
}
});

/**

* Memeriksa URL.

* @param {string} value

* @returns {boolean}
  */
  function validURL(value) {
  try {
  const url = new URL(value);
  
  return (
  url.protocol === "https:" ||
  url.protocol === "http:"
  );
  } catch {
  return false;
  }
  }

// Tombol proses
resolveBtn.addEventListener("click", async () => {
const link = input.value.trim();

result.classList.add("hidden");
error.classList.add("hidden");

if (!link || !validURL(link)) {
showError("Masukkan link HTTP atau HTTPS yang valid.");
return;
}

loading.classList.remove("hidden");
resolveBtn.disabled = true;

try {
const response = await fetch("/api/resolve", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
url: link
})
});

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.error || "Link tidak dapat diproses."
  );
}

if (
  typeof data.destination !== "string" ||
  !validURL(data.destination)
) {
  throw new Error("Alamat tujuan tidak valid.");
}

finalLink = data.destination;

destination.textContent = finalLink;
openBtn.href = finalLink;

result.classList.remove("hidden");

} catch (err) {
const message = err instanceof Error
? err.message
: "Terjadi kesalahan.";

showError(message);

} finally {
loading.classList.add("hidden");
resolveBtn.disabled = false;
}
});

// Tombol salin
copyBtn.addEventListener("click", async () => {
if (!finalLink) return;

try {
await navigator.clipboard.writeText(finalLink);
copyBtn.textContent = "✓ BERHASIL DISALIN";
} catch {
showError("Gagal menyalin link.");
}
});