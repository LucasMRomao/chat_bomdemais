$(() => {
    console.log("socket");
    var socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    });

    $("#ulContatos>.list-group-item-action").click((event) => {
        $("#ulContatos>.active").removeClass("active");
        $(event.currentTarget).addClass("active");
    });
});