$(() => {
    $("#bEntrar").click(() => {
        let usuario = $("#iUsuario").val();
        let senha = $("#iSenha").val();

        if(!usuario || !senha){
            $("#modalVazio").modal('show');
        }
    });

    $("#bFechar").click(() => {
        if(confirm("Deseja realmente sair do sistema?")){
            window.close();
        }
    });
});