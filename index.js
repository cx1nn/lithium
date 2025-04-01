import express from 'express';
import { createBareServer } from '@tomphttp/bare-server-node';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import { createServer as httpServer, createServer as httpsServer } from 'http';
import path from 'path';
import chalk from 'chalk';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 8080;
const bare = createBareServer('/bare/');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'static')));

const pages = [
    { route: '/~', file: 'apps.html' },
    { route: '/1', file: 'tabs.html' },
    { route: '/2', file: 'go.html' },
    { route: '/3', file: 'index.html' },
];

pages.forEach(({ route, file }) =>
    app.get(route, (_, res) => res.sendFile(path.join(__dirname, 'static', file)))
);

app.use((req, res) => {
    if (bare.shouldRoute(req)) bare.routeRequest(req, res);
    else res.status(404).send('Not Found');
});

const server = existsSync(path.join(__dirname, 'key.pem')) && existsSync(path.join(__dirname, 'cert.pem'))
    ? httpsServer({
        key: readFileSync(path.join(__dirname, 'key.pem')),
        cert: readFileSync(path.join(__dirname, 'cert.pem')),
    }, app)
    : httpServer(app);

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req, socket, head)) bare.routeUpgrade(req, socket, head);
    else socket.end();
});

server.listen(PORT, () => {
    const addr = server.address();
    const networkIP = Object.values(os.networkInterfaces()).flat().find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

    console.clear();
    console.log(chalk.cyan('╔════════════════════════════════╗'));
    console.log(chalk.bold.magenta('        🌟 Lithium Protection 🌟'));
    console.log(chalk.cyan('╚════════════════════════════════╝'));
    console.log(chalk.yellow(`Local:    http://localhost:${addr.port}`));
    console.log(chalk.yellow(`Network:  http://${networkIP}:${addr.port}`));
    console.log(chalk.cyan('══════════════════════════════════'));
});