var form = document.getElementById("form");
var input = document.getElementById("input");
var discord = document.getElementById("discord");




function openURL(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    input.value = url;
    form.dispatchEvent(new Event('submit'));
}

async function init() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        if (localStorage.getItem("transport") == "epoxy") {
            if (await connection.getTransport() !== "/epoxy/index.mjs") {
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                console.log("Using websocket transport. Wisp URL is: " + wispUrl);
            }
        }
        else {
            if (await connection.getTransport() !== "/libcurl/index.mjs") {
                await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
                console.log("Using websocket transport. Wisp URL is: " + wispUrl);
            }
        }

    } catch (err) {
        console.error("An error occurred while setting up baremux:", err);
    }
    try {
        const scramjet = new ScramjetController({
            prefix: "/scram/service/",
            files: {
                wasm: "/scram/scramjet.wasm.js",
                worker: "/scram/scramjet.worker.js",
                client: "/scram/scramjet.client.js",
                shared: "/scram/scramjet.shared.js",
                sync: "/scram/scramjet.sync.js"
            },
            flags: {
                syncxhr: true
            }
        });
        window.sj = scramjet;
        scramjet.init("/sw.js");


    } catch (error) {
        console.error("Error setting up uv & sj:", error);
    }
    if (!localStorage.getItem("proxy")) {
        localStorage.setItem("proxy", "uv");
    }

    try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Registering service worker...");
    } catch (err) {
        throw new Error(err)
    }
}
init();

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!localStorage.getItem("proxy")) {
            localStorage.setItem("proxy", "uv");
        }

        var url = input.value.trim();
        if (!isUrl(url)) {
            if (localStorage.getItem("engine") == "google") {
                url = "https://www.google.com/search?q=" + url;
            }
            else {
                url = "https://duckduckgo.com/?t=h_&q=" + url;
            }
        } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
        }

        if (localStorage.getItem("proxy") == "uv") {
            url = __uv$config.prefix + __uv$config.encodeUrl(url);
            localStorage.setItem("url", url);
            window.location.href = "/go.html";
        }
        else if (localStorage.getItem("proxy") == "sj") {
            url = "/scram/service/" + encodeURIComponent(url);
            localStorage.setItem("url", url);
            window.location.href = "/go.html";
        }
    });
}

function isUrl(val = "") {
    if (
        /^http(s?):\/\//.test(val) ||
        (val.includes(".") && val.substr(0, 1) !== " ")
    ) {
        return true;
    }
    return false;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function getSearchEngineURL() {
    const engine = localStorage.getItem("engine") || "google";
    const engines = {
        "google": "https://www.google.com/search?q=",
        "duckduckgo": "https://duckduckgo.com/?q="
    };
    return engines[engine] || engines.google;
}

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (err) {
            console.error('Service worker registration failed:', err);
        }
    }
}

function getProxyInstance() {
    const proxyType = localStorage.getItem("proxy") || "uv";
    if (proxyType === "uv") {
        return __uv$config;
    } else {
        return ScramjetController;
    }
}

function encodeURL(url, proxy) {
    if (proxy === "uv") {
        return __uv$config.prefix + __uv$config.encodeUrl(url);
    } else {
        return ScramjetController.getProxyUrl(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const appButtons = document.querySelectorAll('.app-button');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput.value) {
                openURL(searchInput.value);
            }
        });
    }
    
    appButtons.forEach(button => {
        button.addEventListener('click', () => {
            const appName = button.getAttribute('data-app');
            if (appName) {
                openApp(appName);
            }
        });
    });
});

// Clean search functionality
document.getElementById('searchApps')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const apps = document.querySelectorAll('.app-button');
    
    apps.forEach(app => {
        const text = app.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            app.classList.remove('hidden');
        } else {
            app.classList.add('hidden');
        }
    });
});

