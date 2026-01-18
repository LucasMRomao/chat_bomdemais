function abrirTelaConfiguracoes(usuario, senha){
    $.ajax({
        url: CONFIG.URL_API + "/getUsuarioByCredentials",
        method: "GET",
        data: {
            usuario: usuario,
            senha: senha
        },
        success: (result) => {
            if(result[0][0]){
                alert("Usuário: " + result[0][0].usuario + " / Senha: " + result[0][0].senha)
            }else{
                $("#modal-configuracoes").modal('hide')
                $("#modal-credenciais-incorretas").modal('show');
            }
        }
    });
}

$(() => {
    $("#bEntrar").click(() => {
        let usuario = $("#iUsuario").val();
        let senha = $("#iSenha").val();

        if(!usuario || !senha){
            $("#modalVazio").modal('show');
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
                        abrirTelaPrincipal(usuario);
                    }else{
                        $("#modal-configuracoes").modal('hide')
                        $("#modal-credenciais-incorretas").modal('show');
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
            alert("Ambos os campos devem ser preenchidos!");
        }else{
            abrirTelaConfiguracoes(usuario, senha);
        }
    }); 

    $("#btn-credenciais-incorretas").click(() => {
        $("#modal-credenciais-incorretas").modal('hide');
        $("#modal-configuracoes").modal('show');
    });

    var socket = io(CONFIG.URL_SERVIDOR_SOCKET);

    socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    })
});