# 概要
指定のDIV要素をPDFファイルへ出力する例。  
PDFファイルへ出力処理をメインに、ファイルパス生成などは簡略しています。  
サードパティーのライブラリは、CDNで読み込んでいます(本来はnpmでrequire)。  

# ファイル構成
./  
 +- index.js  
 +- main.html  
 +- worker.html (印刷イメージを作成する画面で実行時は非表示)  
 +- package.json  

# 検証環境
macOS Sierra 10.12.3  
Electron v1.6.0  
materialize 0.98.0  
jQuery 3.1.1  

# ダウンロードと実行
```
$ git clone https://github.com/usazukinchan/electron-sample-print-to-pdf
$ cd electron-sample-print-to-pdf
$ npm install
$ npm start
```
