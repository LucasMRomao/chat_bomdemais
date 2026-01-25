/*async function teste(){
    const response = await window.api.ping("pong, pong");

    console.log(response)
}

teste()*/

async function abrirTelaPrincipal(usuario, id, nome) {
    const response = await window.api.abrirTelaPrincipal(usuario, id, nome);
}

async function abrirTelaConfiguracoes(usuario){
    const response = await window.api.abrirTelaConfiguracoes(usuario);
}

async function pegarDadosUsuarioOnline(){
    const response = await window.api.pegarDadosUsuarioOnline();
    return response;
}