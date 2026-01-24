const { contextBridge, ipcRenderer } = require("electron")
window.ipcRenderer = require("electron").ipcRenderer

contextBridge.exposeInMainWorld("api", {
    ping: (nome) => ipcRenderer.invoke("ping", nome),
    abrirTelaPrincipal: (usuarioLogado, nomeLogado) => ipcRenderer.send("abrir-tela-principal", usuarioLogado, nomeLogado),
    abrirTelaConfiguracoes: (usuarioLogado) => ipcRenderer.send("abrir-tela-configuracoes", usuarioLogado),
    pegarDadosUsuarioOnline: () => ipcRenderer.invoke("pegar-dados-usuario-online"),
    teste: () => 'TESTEOK'
});