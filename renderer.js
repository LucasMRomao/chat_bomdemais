async function teste(){
    const response = await window.api.ping("pong, pong");

    console.log(response)
}

teste()

async function abrirTelaPrincipal(usuario) {
    const response = await window.api.abrirTelaPrincipal(usuario);
}