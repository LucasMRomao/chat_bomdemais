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
                $("#modal-configuracoes").modal('hide')
                $("#modal-credenciais-incorretas").modal('show');
            }
        }
    });
}

$(() => {

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
            autenticarConfiguracoes(usuario, senha);
        }
    }); 

    $("#btn-credenciais-incorretas").click(() => {
        $("#modal-credenciais-incorretas").modal('hide');
        $("#modal-configuracoes").modal('show');
    });
});