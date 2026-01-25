var socket = null;
var usuarioLogado = "";
var idUsuarioLogado = "";

const atualizarUsuariosOnline = (lista) => {
    $("#ulContatos").html("");

    console.log(lista);

    for(var i in lista){
        console.log(lista[i].id);
        let $user = `<a href='#' class='list-group-item list-group-item-action' userid='${lista[i].id}' username='${lista[i].usuario}'>${lista[i].nome}</a>`;
        $("#ulContatos").append($user);
    }

    $("#ulContatos>.list-group-item-action").click((event) => {
        $("#ulContatos>.active").removeClass("active");
        $(event.currentTarget).addClass("active");
        $("#iMensagemEnviar").prop("disabled", false);
        $("#bEnviarMensagem").prop("disabled", false);
    });
}

const sinalizarUsuarioOnline = async () => {
    let dados = await pegarDadosUsuarioOnline();
    socket.emit("user-online", dados.id, dados.nome, dados.usuario);
    usuarioLogado = dados.usuario;
    idUsuarioLogado = dados.id;
}

$(() => {
    socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    });

    sinalizarUsuarioOnline();
    //socket.emit("user-offline", "lucas");
    
    socket.on("atualiza-usuarios-online", (usuariosOnline) => {
        atualizarUsuariosOnline(usuariosOnline);
    });

    $("#bEnviarMensagem").click(() => {
        let usuarioID = $("#ulContatos>.active").attr("userid");
        let mensagem = $("#iMensagemEnviar").val();

        console.log(usuarioID);
        console.log(idUsuarioLogado);
        console.log(mensagem);

        $.ajax({
            url: CONFIG.URL_API + "/mensagens",
            method: "POST",
            data: {
                id_usuario_envia: idUsuarioLogado,
                id_usuario_recebe: usuarioID,
                mensagem: mensagem
            },
            success: (result) => {
                console.log(result);
                $("#iMensagemEnviar").val("");
            }
        });
    });
});