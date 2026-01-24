const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")

const app = express();
const server = createServer(app);
const io = new Server(server);

var usuariosOnline = new Array();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
        let index = usuariosOnline.findIndex((user) => user.socketid == socket.id);
        usuariosOnline.splice(index, 1);
        io.emit("atualiza-usuarios-online", usuariosOnline);
    })

    socket.on("teste", (a, b) => {
        console.log(`Test emmitted: ${a} + ${b}`);
        socket.emit("retorno_teste", "Funcionou!", "Que orgulho!", "Bom demais")
    });

    socket.on("user_online", (nome, username) => {
        let usuario = {
            nome: nome,
            usuario: username,
            socketid: socket.id
        };

        usuariosOnline.push(usuario);
        io.emit("atualiza-usuarios-online", usuariosOnline);
    });

    socket.on("user_offline", (username) => {
        let index = usuariosOnline.findIndex((user) => user.usuario == username);
        usuariosOnline.splice(index, 1); //O primeiro parâmetro é o índice a iniciar a remoção. O segundo é a quantidade de itens a remover
        io.emit("atualiza-usuarios-online", usuariosOnline);
    });

    socket.on("verifica-usuario-online", (username) => {
        console.log(`Verificando se ${username} está online`);
        let index = usuariosOnline.findIndex((user) => user.usuario == username);
        socket.emit("retorno-verifica-online", index > -1);
    });
});

server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});