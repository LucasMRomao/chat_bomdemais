const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("teste", (a, b) => {
        console.log(`Test emmitted: ${a} + ${b}`);
    });
})

server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});