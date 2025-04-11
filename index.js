import express from "express";
import { createServer } from "node:http";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
;

const __dirname = process.cwd();
const app = express();

const publicPath = join(__dirname, "static");
app.use(express.static(publicPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));

const server = createServer();

app.get("/", (req, res) => {
    res.sendFile(join(publicPath, "index.html"));
});

app.use((req, res) => {
    res.status(404);
    res.sendFile(join(publicPath, "index.html"));
});

server.on("request", (req, res) => {
    
    app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.destroy();
        return;
    }


    wisp.routeRequest(req, socket, head);
});

let port = parseInt(process.env.PORT || "8080");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
    const address = server.address();

    console.log("Lithium Protection Active");
    console.log("Listening on:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
    console.log(
        `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
        }:${address.port}`
    );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    process.exit(0);
}

server.listen({
    port,
});