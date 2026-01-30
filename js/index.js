var socket = null;
var usuarioLogado = "";
var idUsuarioLogado = "";

const atualizarUsuariosOnline = (lista) => {
    for(let i in lista){
        //console.log(`USUARIO ONLINE: ${lista[i].id}`);
        $(`li[userid='${lista[i].id}'] a i`).toggleClass("user-online user-offline fa-comment-slash fa-comment");
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
                let $user = `<li class="sidebar-item" userid='${result[i].id}' username='${result[i].usuario}'><a href="#" class="sidebar-link"><i class="fa-solid fa-comment-slash user-offline"></i><span class="user-name">${result[i].nome}</span></a></li>`;
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
        }
    });
}

$(() => {
    socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    carregarUsuarios();
    sinalizarUsuarioOnline();
    //socket.emit("user-offline", "lucas");
    
    socket.on("atualiza-usuarios-online", (usuariosOnline) => {
        atualizarUsuariosOnline(usuariosOnline);
    });

    socket.on("receber-mensagem", (idUsuarioEnvia, mensagem) => {
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
            let spanAlertaMensagem = $(`#sidebar-usuarios>li[userid='${idUsuarioEnvia}']>.span-alerta-mensagem`);
            
            if(spanAlertaMensagem.length == 0 ){
                $(`#sidebar-usuarios>li[userid='${idUsuarioEnvia}']`).prepend(`<span class="badge text-bg-warning span-alerta-mensagem">1</span>`);
            }else{
                let totalMensagens = Number(spanAlertaMensagem.text());
                totalMensagens++;
                spanAlertaMensagem.text(totalMensagens);
            }
        }
    });

    $("#bEnviarMensagem").click(() => {
        let usuarioID = $(`.user-selected`).attr("userid");
        let mensagem = $("#iMensagemEnviar").val();

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

    $("#bConfirmaLogout").click((event) => {
        logout();
    });

    $("#bConfirmaAlterarSenha").click((event) => {
        let novaSenha = $("#iAlterarSenha").val();
        let confirmaNovaSenha = $("#iConfirmaAlterarSenha").val();

        if(!novaSenha || !confirmaNovaSenha){
            $("#sMensagem").text("Insira a nova senha em ambos os campos!");
            $("#modal-mensagem").modal("show");
        }else if(novaSenha != confirmaNovaSenha){
            $("#sMensagem").text("As senhas devem ser iguais!");
            $("#modal-mensagem").modal("show");
        }else{
            $.ajax({
                url: `${CONFIG.URL_API}/usuarios/${idUsuarioLogado}` ,
                method: "PUT",
                data: {
                    senha: novaSenha
                },
                success: (result) => {
                    $("#modal-alterar-senha").modal("hide");
                    $("#iAlterarSenha").val("");
                    $("#iConfirmaAlterarSenha").val("");
                    if(result){
                        $("#sMensagem").text("Senha alterada com sucesso!");
                        $("#modal-mensagem").modal("show");
                    }else{
                        $("#sMensagem").text("Erro ao alterar senha. Tente novamente!");
                        $("#modal-mensagem").modal("show");
                    }
                }
            });
        }
    });
});