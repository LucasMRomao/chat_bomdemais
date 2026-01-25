const { contextBridge, ipcRenderer } = require("electron")
window.ipcRenderer = require("electron").ipcRenderer

contextBridge.exposeInMainWorld("api", {
    ping: (nome) => ipcRenderer.invoke("ping", nome),
    abrirTelaPrincipal: (usuarioLogado, idLogado, nomeLogado) => ipcRenderer.send("abrir-tela-principal", usuarioLogado, idLogado, nomeLogado),
    abrirTelaConfiguracoes: (usuarioLogado) => ipcRenderer.send("abrir-tela-configuracoes", usuarioLogado),
    pegarDadosUsuarioOnline: () => ipcRenderer.invoke("pegar-dados-usuario-online")
});