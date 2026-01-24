var auxUsuario = "", auxNome = "";

function autenticarConfiguracoes(usuario, senha){
    $.ajax({
        url: CONFIG.URL_API + "/getUsuarioByCredentials",
        method: "GET",
        data: {
            usuario: usuario,
            senha: senha
        },
        success: (result) => {
            if(result[0][0]){
                abrirTelaConfiguracoes(usuario);
            }else{
                $("#modal-configuracoes").modal('hide');
                $("#modal-mensagem").text("Usuário e/ou senha incorreto(s).");
                $("#modal-exibir-mensagem").modal('show');
            }
        }
    });
}

$(() => {

    var socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    socket.on("retorno-verifica-online", (isOnline) => {
        if(isOnline){
            $("#modal-mensagem").text("O usuário informado já está logado!");
            $("#modal-exibir-mensagem").modal("show");  
        }else{
            abrirTelaPrincipal(auxUsuario, auxNome);
        }
    });

    $("#iUsuario").keyup((event) => {
        if(event.keyCode == 13) $("#bEntrar").click() //13 = Enter
    });

    $("#iSenha").keyup((event) => {
        if(event.keyCode == 13) $("#bEntrar").click() //13 = Enter
    })

    $("#bEntrar").click(() => {
        let usuario = $("#iUsuario").val();
        let senha = $("#iSenha").val();

        if(!usuario || !senha){
            $("#modal-mensagem").text("Insira um usuário e uma senha.");
            $("#modal-exibir-mensagem").modal('show');
        }else{
            $.ajax({
                url: CONFIG.URL_API + "/getUsuarioByCredentials",
                method: "GET",
                data: {
                    usuario: usuario,
                    senha: senha
                },
                success: (result) => {
                    if(result[0][0]){
                        socket.emit("verifica-usuario-online", usuario);
                        auxUsuario = result[0][0].usuario;
                        auxNome = result[0][0].nome;
                    }else{
                        $("#modal-configuracoes").modal('hide');
                        $("#modal-mensagem").text("Usuário e/ou senha incorreto(s).");
                        $("#modal-exibir-mensagem").modal('show');
                    }
                }
            });
        }
    });

    $("#bFechar").click(() => {
        if(confirm("Deseja realmente sair do sistema?")){
            window.close();
        }
    });

    $("#bLogarConfiguracoes").click(() => {
        let usuario = $("#iUsuarioConfiguracoes").val();
        let senha = $("#iSenhaConfiguracoes").val();

        if(!usuario || !senha){
            $("#modal-configuracoes").modal('hide');
            $("#modal-mensagem").text("Ambos os campos devem ser preenchidos!");
            $("#modal-exibir-mensagem").modal('show');
        }else{
            autenticarConfiguracoes(usuario, senha);
        }
    }); 

    $("#btn-credenciais-incorretas").click(() => {
        $("#modal-credenciais-incorretas").modal('hide');
        $("#modal-configuracoes").modal('show');
    });
});