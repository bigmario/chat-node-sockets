const { Server } = require('net');



const HOST = '0.0.0.0'
const END = 'END';

const error = (err) => {
    console.error(err);
    process.exit(1)
};

const listen = (port) => {
    const server = new Server();

    server.on('connection', (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;

        console.log(`New Connection from ${remoteSocket}`);
        socket.setEncoding('utf-8');
        socket.on('data', (message) => {
            if (message === END) {
                socket.end();
            } else {
                console.log(`${remoteSocket} -> ${message}`);
            }
        });
        socket.on('close', () => {
            console.log(`Connection with ${remoteSocket} ended!`);
        });
    });

    server.listen({ port, host: HOST }, () => {
        console.log(`Server Listening on http://${HOST}:${port}`);
    });

    server.on('error', (err) => error(err.message));
};


const main = () => {
    if (process.argv.length !== 3) {
        error(`Usage: node ${__filename} port`)
    }

    let port = process.argv[2];

    if (isNaN(port)) {
        console.error(`Invalid port ${port}`);
    }

    port = parseInt(port);

    listen(port);
};

if (require.main === module) {
    main();
}