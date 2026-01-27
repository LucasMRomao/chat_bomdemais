const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("node:path")

let userLogado = ''
let idUserLogado = ''
let nomeUserLogado = ''

let janelaLogin;
let janelaPrincipal;

//Janela Inicial
const createWindow = () => {
  janelaLogin = new BrowserWindow({
    width: 600,
    height: 600,
    icon: './img/icone.png',
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  janelaLogin.loadFile('pages/login.html')
}

const abrirTelaPrincipal = () => {
  janelaPrincipal = new BrowserWindow({
    width: 600,
    height: 600,
    icon: './img/icone.png',
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  janelaPrincipal.loadFile('./pages/index.html')
  if(janelaLogin) janelaLogin.close()
}

const abrirTelaConfiguracoes = () => {
  const configuracoes = new BrowserWindow({
    width: 800,
    height: 800,
    icon: './img/icone.png',
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
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

  //ipcMain.handle("ping", (event, nome) => nome)

  ipcMain.on("abrir-tela-principal", (event, usuarioLogado, idUsuarioLogado, nomeUsuarioLogado) => {
    userLogado = usuarioLogado;
    idUserLogado = idUsuarioLogado;
    nomeUserLogado = nomeUsuarioLogado;
    abrirTelaPrincipal();
  });

  ipcMain.on("abrir-tela-configuracoes", (event, usuarioLogado, nomeUsuarioLogado) => {
    console.log(usuarioLogado + " - " + nomeUsuarioLogado);
    abrirTelaConfiguracoes();
  });

  ipcMain.handle("pegar-dados-usuario-online", (event) => {
    let user = {
      id: idUserLogado,
      usuario: userLogado,
      nome: nomeUserLogado
    }
    
    return user;
  })

  ipcMain.on("logout", (event) => {
    createWindow()
    if(janelaPrincipal) janelaPrincipal.close();
    userLogado = '';
    idUserLogado = '';
    nomeUserLogado = '';
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") { //darwin = MacOS
    app.quit();
  }
})