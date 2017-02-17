const {app, BrowserWindow, ipcMain, shell} = require("electron");
const path = require("path");
const fs = require("fs");

var mainWindow = null;
var workerWindow = null;

// シングルページのアプリとしてメインが閉じたら終了とする
app.once("ready", () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL("file://" + __dirname + "/main.html");
  mainWindow.openDevTools();

  mainWindow.on("closed", () => {
    // workerページの解放漏れが無いことを確認するためのリスト
    // * この時点でmainページは含まれないので正常なら対象がない
    console.log("window list =",
        BrowserWindow.getAllWindows().map((win) => { return win.id; }));
    app.quit();
  });
});

// mainページからの印刷要求
ipcMain.on("print-to-pdf", (event, content) => {
  if (workerWindow !== null) {
    // エラーにより前回のページが残っていたら閉じる
    workerWindow.close();
  }

  workerWindow = new BrowserWindow({ show: false });
  workerWindow.loadURL("file://" + __dirname + "/worker.html");
  workerWindow.openDevTools();

  workerWindow.on("closed", () => {
    workerWindow = null;
  });

  // workerページが準備完了した後に要求を投げるようにする
  workerWindow.on("ready-to-show", () => {
    workerWindow.send("print-to-pdf", content);
  });
});

// workerページからの準備完了通知
ipcMain.on("ready-print-to-pdf", (event) => {
  const pdfPath = path.join(app.getPath("temp"), "print.pdf");
  const options = { printBackground: true };

  workerWindow.webContents.printToPDF(options, (error, data) => {
    if (error) {
      throw error;
    }
    fs.writeFile(pdfPath, data, (error) => {
      if (error) {
        throw error;
      }
      // プレビュー表示
      shell.openItem(pdfPath);
      // PDFファイルは書き込み済みなのでworkerページは閉じても大丈夫
      workerWindow.close(); 
    });
  });
});
