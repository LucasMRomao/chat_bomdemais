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

    var socket = io("http://localhost:3000");

    socket.emit("teste", 'Bom', 'Demais');

    socket.on("retorno_teste", (val1, val2, val3) => {
        console.log(val1);
        console.log(val2);
        console.log(val3);
    })
});