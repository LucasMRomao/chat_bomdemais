var socket = null;

const atualizarUsuariosOnline = (lista) => {
    $("#ulContatos").html("");

    for(var i in lista){
        let $user = "<a href='#' class='list-group-item list-group-item-action'>";
        $user += lista[i].nome;
        $user += "</a>";

        $("#ulContatos").append($user);
    }

    $("#ulContatos>.list-group-item-action").click((event) => {
        $("#ulContatos>.active").removeClass("active");
        $(event.currentTarget).addClass("active");
    });
}

const sinalizarUsuarioOnline = async () => {
    let dados = await pegarDadosUsuarioOnline();
    socket.emit("user_online", dados.nome, dados.usuario);
}

$(() => {
    socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    });

    sinalizarUsuarioOnline(socket);
    //socket.emit("user-offline", "lucas");
    
    socket.on("atualiza-usuarios-online", (usuariosOnline) => {
        atualizarUsuariosOnline(usuariosOnline);
    });
});