const esconderSenha = (senha) => {
    let ret = ""
    for(i in senha){
        ret += "*";
    }
    return ret;
}

const editarUsuario = (id, usuario, senha) => {
    $("#iEditarID").val(id);
    $("#iEditarUsuario").val(usuario);
    $("#iEditarSenha").val(senha);
}

const excluirUsuario = (id) => {
    if(confirm("Deseja realmente excluir o usuário selecionado?")){
        $.ajax({
            url: CONFIG.URL_API + "/usuarios/" + id,
            method: "DELETE",
            success: (result) => {
                if(result){
                    $("#modal-mensagem").text("Usuário deletado com sucesso!");
                    $("#modal-exibir-mensagem").modal('show');
                    carregarUsuarios();
                }
            }
        });
    }
}

const carregarUsuarios = () => {

    $("#tableUsuario>tbody").html("");
    
    $.ajax({
        url: CONFIG.URL_API + "/usuarios",
        method: "GET",
        success: (result) => {
            for(i in result){
                console.log(result[i]);

                let id = result[i].id;
                let nome = result[i].nome;
                let usuario = result[i].usuario;
                let senha = result[i].senha;

                let $linhaUsuario = "<tr><td>";
                $linhaUsuario += id;
                $linhaUsuario += "</td><td>";
                $linhaUsuario += nome;
                $linhaUsuario += "</td><td>"
                $linhaUsuario += usuario;
                $linhaUsuario += "</td><td>";
                $linhaUsuario += esconderSenha(senha);
                $linhaUsuario += "</td><td>";
                $linhaUsuario += "<button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modal-editar-usuario' onclick='editarUsuario(\"" + id + "\", \"" + usuario  + "\", \"" + esconderSenha(senha) + "\")'>Editar</button>&nbsp;";
                $linhaUsuario += "<button class='btn btn-danger' onclick='excluirUsuario(\"" + id + "\")'>Excluir</button>";
                $linhaUsuario += "</td>";
                $linhaUsuario += "</tr>";

                $("#tableUsuario>tbody").append($linhaUsuario);
            }
        }
    });
}

$(() => {
    carregarUsuarios();

    $("#iAdicionarNome").keyup((event) => {
        if(event.keyCode == 13){ //13 = Enter
            $("#bAdicionarUsuario").click();
        }
    });

    $("#iAdicionarUsuario").keyup((event) => {
        if(event.keyCode == 13){ //13 = Enter
            $("#bAdicionarUsuario").click();
        }
    });

    $("#bAdicionarUsuario").click(() => {
        let nome = $("#iAdicionarNome").val();
        let usuario = $("#iAdicionarUsuario").val();

        $.ajax({
            url: CONFIG.URL_API + "/usuarios",
            method: "POST",
            data: {
                nome: nome,
                usuario: usuario,
                senha: '12345'
            },
            success: (result) => {
                if(result){
                    $("#modal-mensagem").text("Usuário adicionado com sucesso!");
                    $("#modal-exibir-mensagem").modal('show');
                    carregarUsuarios();
                }
            }
        });
    });

    $("#bResetarSenha").click(() => {
        if(confirm("Deseja realmente resetar a senha do usuário selecionado?")){
            $.ajax({
                url: CONFIG.URL_API + "/resetarSenhaUsuario",
                method: "PUT",
                data: {
                    id_usuario: $("#iEditarID").val()
                },
                success: (result) => {
                    if(result){
                        $("#modal-mensagem").text("Senha do usuário resetada com sucesso!");
                        $("#modal-exibir-mensagem").modal("show");
                        $("#modal-editar-usuario").modal('hide');
                        $("#iAdicionarSenha").val("12345");
                    }
                }
            })
        }
    });
});