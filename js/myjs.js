$(() => {
    $("#bEntrar").click(() => {
        let usuario = $("#iUsuario").val();
        let senha = $("#iSenha").val();

        if(!usuario || !senha){
            $("#modalVazio").modal('show');
        }
    });
});