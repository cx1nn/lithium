importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts("/scram/scramjet.wasm.js", "/scram/scramjet.shared.js", "/scram/scramjet.worker.js");
importScripts('/dynamic/dynamic.config.js');
importScripts('/dynamic/dynamic.worker.js');

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();
const dynamic = new Dynamic();

self.dynamic = dynamic;

let secretedata;

self.addEventListener("message", ({ data }) => {
    if (data.type === "secretedata") {
        secretedata = data;
    }
});

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }

    await scramjet.loadConfig();
    if (scramjet.route(event)) {
        return await scramjet.fetch(event);
    }
    if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
    }

    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});