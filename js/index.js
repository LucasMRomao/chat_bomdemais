var socket = null;
var usuarioLogado = "";
var idUsuarioLogado = "";

const atualizarUsuariosOnline = (lista) => {
    $("#ulContatos").html("");

    //console.log(lista);

    for(var i in lista){
        console.log(lista[i].id);
        let $user = `<a href='#' class='list-group-item list-group-item-action' userid='${lista[i].id}' username='${lista[i].usuario}'>${lista[i].nome}</a>`; //<span class="badge text-bg-warning">!</span>
        $("#ulContatos").append($user);
    }

    $("#ulContatos>.list-group-item-action").click((event) => {
        $("#ulContatos>.active").removeClass("active");
        $(event.currentTarget).addClass("active");
        $("#iMensagemEnviar").prop("disabled", false);
        $("#bEnviarMensagem").prop("disabled", false);
        
        /*let listaAlertas = $(".span-alerta-mensagem");
        console.log(listaAlertas);
        console.log(listaAlertas.parent().attr("userid"));

        for(let i in listaAlertas){
            if(listaAlertas[i].parent().attr("userid") == $(event.currentTarget).attr("userid")) $(listaAlertas[i]).remove();
        }*/
    });
}

const sinalizarUsuarioOnline = async () => {
    let dados = await pegarDadosUsuarioOnline();
    usuarioLogado = dados.usuario;
    idUsuarioLogado = dados.id;
    socket.emit("user-online", dados.id, dados.nome, dados.usuario);
}

$(() => {
    socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    /*socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    });*/

    sinalizarUsuarioOnline();
    //socket.emit("user-offline", "lucas");
    
    socket.on("atualiza-usuarios-online", (usuariosOnline) => {
        atualizarUsuariosOnline(usuariosOnline);
    });

    socket.on("receber-mensagem", (idUsuarioEnvia, mensagem) => {
        //console.log(`ID Usuário: ${idUsuarioEnvia} - MENSAGEM: ${mensagem}`);

        let userAtivo = $("#ulContatos>.active");
        
        if($(userAtivo).attr("userid") == idUsuarioEnvia){ //O usuário ativo é quem enviou a mensagem
            let $mensagem = `<div class="col-12 mensagem mensagemRecebida d-flex h-auto"><span class="badge text-bg-warning span-msg">${mensagem}</span></div>`;
            $(".mensagens").append($mensagem);

            // Animate the scroll of the 'html' and 'body' elements
            $('.mensagens').animate({
                // Calculate the target position: the element's distance from the top of the document
                scrollTop: $(".mensagem").last().offset().top
            }, 1000); // 1000ms is the duration of the animation (1 second)

        }else{
            $(`#ulContatos>[userid=${idUsuarioEnvia}]`).append(`<span class="badge text-bg-warning span-alerta-mensagem">!</span>`);
        }
    });

    $("#bEnviarMensagem").click(() => {
        let usuarioID = $("#ulContatos>.active").attr("userid");
        let mensagem = $("#iMensagemEnviar").val();

        /*console.log(usuarioID);
        console.log(idUsuarioLogado);
        console.log(mensagem);*/

        $.ajax({
            url: CONFIG.URL_API + "/mensagens",
            method: "POST",
            data: {
                id_usuario_envia: idUsuarioLogado,
                id_usuario_recebe: usuarioID,
                mensagem: mensagem
            },
            success: (result) => {
                //console.log(result);
                $("#iMensagemEnviar").val("");
                let $mensagem = `<div class="col-12 mensagem mensagemEnviada d-flex h-auto"><span class="badge text-bg-success ms-auto span-msg">${mensagem}</span></div>`;
                $(".mensagens").append($mensagem);
                
                // Animate the scroll of the 'html' and 'body' elements
                $('.mensagens').animate({
                    // Calculate the target position: the element's distance from the top of the document
                    scrollTop: $(".mensagem").last().offset().top
                }, 1000); // 1000ms is the duration of the animation (1 second)

                socket.emit("enviar-mensagem", idUsuarioLogado, usuarioID, mensagem);
            }
        });
    });
});