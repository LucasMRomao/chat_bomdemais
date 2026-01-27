var socket = null;
var usuarioLogado = "";
var idUsuarioLogado = "";

/*const atualizarUsuariosOnline = (lista) => {
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
        
        $(event.currentTarget).find(".span-alerta-mensagem").remove(); //Remove o alerta de mensagens ao selecionar usuário

        $(".mensagens").html("");

        let idUsuarioSelecionado = $(event.currentTarget).attr("userid");

        //console.log(`PEGANDO MENSAGENS ENTRE ${idUsuarioLogado} E ${idUsuarioSelecionado}`);

        $.ajax({
            url: CONFIG.URL_API + "/getMensagensEntreUsuarios",
            method: "GET",
            data: {
                usuario1: idUsuarioLogado,
                usuario2: idUsuarioSelecionado
            },
            success: (result) => {
                console.log(result[0]);
                if(result[0]){ //Se tiver ao menos 1 mensagem
                    for(let i in result[0]){
                        let $msg = `<div class="col-12 mensagem ${result[0][i].id_usuario_envia == idUsuarioLogado ? "mensagemEnvidada d-flex" : "mensagemRecebida"}"><span class="badge text-bg-${result[0][i].id_usuario_envia == idUsuarioLogado ? "success ms-auto" : "warning"} span-msg">${result[0][i].mensagem}</span></div>`;
                        $(".mensagens").append($msg);
                    }

                    // Animate the scroll of the 'html' and 'body' elements
                    $('.mensagens').animate({
                        // Calculate the target position: the element's distance from the top of the document
                        scrollTop: $('.mensagens')[0].scrollHeight
                    }, 1); // 1ms is the duration of the animation (1 second)
                }
            }
        });
    });
}*/

const atualizarUsuariosOnline = (lista) => {
    console.log("Usuários online");
    console.log(lista);
    for(let i in lista){
        console.log(`USUARIO ONLINE: ${lista[i].id}`);
        $(`li[userid='${lista[i].id}'] a i`).toggleClass("user-online user-offline");
    }

}

const sinalizarUsuarioOnline = async () => {
    let dados = await pegarDadosUsuarioOnline();
    usuarioLogado = dados.usuario;
    idUsuarioLogado = dados.id;
    socket.emit("user-online", dados.id, dados.nome, dados.usuario);
}

const carregarUsuarios = () => {
    $("#sidebar-usuarios").html("");
    $.ajax({
        url: CONFIG.URL_API + "/usuarios",
        method: "GET",
        success: (result) => {
            console.log(result);
            for(let i in result){
                let $user = `<li class="sidebar-item" userid='${result[i].id}' username='${result[i].usuario}'><!--<span class="badge text-bg-warning span-alerta-mensagem">1</span>--><a href="#" class="sidebar-link"><i class="fa-solid fa-comment-slash user-offline"></i><span class="user-name">${result[i].nome}</span></a></li>`;
                $("#sidebar-usuarios").append($user);
            }

            socket.emit("get-users-online");

            $(`li[class='sidebar-item']`).click((event) => {
                $(".user-selected").removeClass("user-selected");
                $(event.currentTarget).addClass("user-selected");
                $("#iMensagemEnviar").prop("disabled", false);
                $("#bEnviarMensagem").prop("disabled", false);
                $(event.currentTarget).find(".span-alerta-mensagem").remove();
                $(".mensagens").html("");

                let idUsuarioSelecionado = $(event.currentTarget).attr("userid");
                
                console.log(`PEGANDO MENSAGENS ENTRE ${idUsuarioLogado} E ${idUsuarioSelecionado}`);

                $.ajax({
                    url: CONFIG.URL_API + "/getMensagensEntreUsuarios",
                    method: "GET",
                    data: {
                        usuario1: idUsuarioLogado,
                        usuario2: idUsuarioSelecionado
                    },
                    success: (result) => {
                        console.log(result[0]);
                        if(result[0]){ //Se tiver ao menos 1 mensagem
                            for(let i in result[0]){
                                let $msg = `<div class="col-12 mensagem ${result[0][i].id_usuario_envia == idUsuarioLogado ? "mensagemEnvidada d-flex" : "mensagemRecebida"}"><span class="badge text-bg-${result[0][i].id_usuario_envia == idUsuarioLogado ? "success ms-auto" : "warning"} span-msg">${result[0][i].mensagem}</span></div>`;
                                $(".mensagens").append($msg);
                            }

                            // Animate the scroll of the 'html' and 'body' elements
                            $('.mensagens').animate({
                                // Calculate the target position: the element's distance from the top of the document
                                scrollTop: $('.mensagens')[0].scrollHeight
                            }, 1); // 1ms is the duration of the animation (1 second)
                        }
                    }
                });
            });
        }
    });
}

$(() => {
    socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    /*socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    });*/

    carregarUsuarios();
    sinalizarUsuarioOnline();
    //socket.emit("user-offline", "lucas");
    
    socket.on("atualiza-usuarios-online", (usuariosOnline) => {
        atualizarUsuariosOnline(usuariosOnline);
    });

    socket.on("receber-mensagem", (idUsuarioEnvia, mensagem) => {
        //console.log(`ID Usuário: ${idUsuarioEnvia} - MENSAGEM: ${mensagem}`);

        //let userAtivo = $("#ulContatos>.active");
        
        let userAtivo = $(`.user-selected`);
        console.log(userAtivo);

        if($(userAtivo).attr("userid") == idUsuarioEnvia){ //O usuário ativo é quem enviou a mensagem
            let $mensagem = `<div class="col-12 mensagem mensagemRecebida d-flex h-auto"><span class="badge text-bg-warning span-msg">${mensagem}</span></div>`;
            $(".mensagens").append($mensagem);

            // Animate the scroll of the 'html' and 'body' elements
            $('.mensagens').animate({
                // Calculate the target position: the element's distance from the top of the document
                scrollTop: $('.mensagens')[0].scrollHeight
            }, 1000); // 1000ms is the duration of the animation (1 second)

        }else{
            //let spanAlertaMensagem = $(`#ulContatos>[userid=${idUsuarioEnvia}]>.span-alerta-mensagem`);
            let spanAlertaMensagem = $(`#sidebar-usuarios>li[userid='${idUsuarioEnvia}']>.span-alerta-mensagem`);
            if(spanAlertaMensagem.length == 0 ){
                //$(`#ulContatos>[userid=${idUsuarioEnvia}]`).append(`<span class="badge text-bg-warning span-alerta-mensagem">1</span>`);
                $(`#sidebar-usuarios>li[userid='${idUsuarioEnvia}']`).prepend(`<span class="badge text-bg-warning span-alerta-mensagem">1</span>`);
            }else{
                let totalMensagens = Number(spanAlertaMensagem.text());
                totalMensagens++;
                spanAlertaMensagem.text(totalMensagens);
            }
        }
    });

    $("#bEnviarMensagem").click(() => {
        //let usuarioID = $("#ulContatos>.active").attr("userid");
        let usuarioID = $(`.user-selected`).attr("userid");
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
                    scrollTop: $('.mensagens')[0].scrollHeight
                }, 1000); // 1000ms is the duration of the animation (1 second)

                socket.emit("enviar-mensagem", idUsuarioLogado, usuarioID, mensagem);
            }
        });
    });
});