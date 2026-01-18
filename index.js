const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("node:path")

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
    resizable: false
  })

  principal.loadFile('pages/index.html')
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

  ipcMain.on("abrir-tela-principal", (envent, usuarioLogado) => {
    console.log(usuarioLogado);
    abrirTelaPrincipal();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") { //darwin = MacOS
    app.quit();
  }
})