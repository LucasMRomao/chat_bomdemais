const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("node:path")

let userLogado = ''
let nomeUserLogado = ''

//Janela Inicial
const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    icon: './img/icone.png',
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  win.loadFile('pages/login.html')
}

const abrirTelaPrincipal = () => {
  const principal = new BrowserWindow({
    width: 600,
    height: 600,
    icon: './img/icone.png',
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  principal.loadFile('./pages/index.html')
}

const abrirTelaConfiguracoes = () => {
  const configuracoes = new BrowserWindow({
    width: 800,
    height: 800,
    icon: './img/icone.png',
    autoHideMenuBar: true,
    resizable: false
  })

  configuracoes.loadFile('./pages/configuracoes.html')
}

app.whenReady().then(() => {
  if(BrowserWindow.getAllWindows().length == 0){
    createWindow()
  }

  app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length == 0){
      createWindow()
    }
  })

  ipcMain.handle("ping", (event, nome) => nome)

  ipcMain.on("abrir-tela-principal", (event, usuarioLogado, nomeUsuarioLogado) => {
    userLogado = usuarioLogado;
    nomeUserLogado = nomeUsuarioLogado;
    abrirTelaPrincipal();
  });

  ipcMain.on("abrir-tela-configuracoes", (event, usuarioLogado, nomeUsuarioLogado) => {
    console.log(usuarioLogado + " - " + nomeUsuarioLogado);
    abrirTelaConfiguracoes();
  });

  ipcMain.handle("pegar-dados-usuario-online", (event) => {
    let user = {
      usuario: userLogado,
      nome: nomeUserLogado
    }

    return user;
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") { //darwin = MacOS
    app.quit();
  }
})