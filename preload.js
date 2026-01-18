const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    ping: (nome) => ipcRenderer.invoke("ping", nome),
    abrirTelaPrincipal: (usuarioLogado) => ipcRenderer.send("abrir-tela-principal", usuarioLogado)
});