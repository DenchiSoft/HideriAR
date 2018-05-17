# Live2D Cubism SDK AR.js Samples

Live2D Cubism SDK For JavaScript と AR.js を組み合わせたサンプルです。

アプリのダウンロードやインストールを行わず、ブラウザだけで AR コンテンツを提供することが可能です。

名刺やポストカード、パンフレット、チラシなど、配布物や掲示物で効果的なプロモーションを行うことができます。

下記のサンプルページを開き、PC やスマートフォンのカメラでマーカーを写せば、 Live2D のモデルが表示されます。

マーカーにロゴ画像を使う例と QR コードを使う例の2種類を用意しています。

### ロゴ画像をマーカーにしたサンプル
|[サンプルページのリンク](https://live2d.github.io/CubismARjsSample/)|マーカー|
|---|---|
|<img src="https://live2d.github.io/CubismARjsSample/assets/logo_qr.png" width="300px">|<img src="https://live2d.github.io/CubismARjsSample/assets/logo_marker.png" width="300px">|

### QR コードをマーカーにしたサンプル
|[サンプルページのリンク兼マーカー](https://live2d.github.io/CubismARjsSample/qr_marker.html)|
|---|
|<img src="https://live2d.github.io/CubismARjsSample/assets/qr_marker.png" width="300px">|


## インストールするには？

1. [トップページ](https://github.com/Live2D/CubismARjsSample) の右上にある "Clone or download" ボタンを押します

2. ポップアップが表示されるので、"Download ZIP" ボタンを押します

3. ダウンロードした zip ファイルを解凍します

4. 解凍した CubismARjsSample フォルダをウェブサーバーにアップロードします

5. アップロード先の URL にアクセスし、カメラでマーカーを写せば、モデルが表示されます。

## サーバーを用意せずにPCだけで試すには？（要ウェブカメラ）

1. Google Chrome に [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=ja) アドオンを追加します

2. Web Server for Chrome を実行し、CHOOSE FOLDER ボタンで CubismARjsSample のあるフォルダを選択します

3. ブラウザから [http://127.0.0.1:8887/CubismARjsSample/](http://127.0.0.1:8887/CubismARjsSample/) にアクセスします

4. カメラでマーカーを映すとモデルが表示されます

## オリジナルのモデルを使うには？

1. assets フォルダの moc3 や json、テクスチャを差し替えます

2. js フォルダの pixiAframeAR.js をテキスト形式で開き、各ファイルへのパスを差し替えたものに変更します

3. オリジナルのモデルが表示されるようになります

## オリジナルのマーカーを使うには？

1. [AR.js Marker Training](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) を開きます

2. UPLOAD ボタンを押し、マーカーにしたい画像を選択します

3. DOWNLOAD ボタンを押し、patt ファイルを assets フォルダに保存します

4. html ファイルの a-marker タグにある url を patt ファイルのパスに変更します

5. 画面中央に表示されている黒枠に囲まれた画像がマーカーとして使えるようになります

## オリジナルのQRコードを使うには？

QR コードの作成方法に指定はありません。

ウェブ上にQRコード生成サービスが多数提供されていますので、お好きなものをお使いください。

**QRコードを [AR.js Marker Training](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) でマーカー画像に指定することも可能です。**

## 機能

- マーカーに対して並行、垂直にモデルを表示

- モデルの複数体表示

- ランダムモーション再生

- カメラ方向への視線追従

- クリック、タップでのモーション切り替え

## 注意事項

### aframe-ar.js の差し替えについて
AR.js の master ブランチで配布されているコードに下記の不具合修正を加えています。

aframe-ar.js を他のバージョンに差し替える際はご注意ください。

- [オリジナルのマーカーを使うための修正](https://github.com/wimvdc/AR.js/commit/950e82db6d0c3851647d429282c5ade52ee95891)

- [画面の向きで縦横比が崩れる不具合の修正](https://github.com/jeromeetienne/AR.js/pull/212/files)


### マーカー検出のフレームレートについて
描画のフレームレートとは別に、 a-scene タグ内でマーカーを検出するフレームレートを指定しています。

検出のフレームレートを上げるとカメラを移動した際にモデルの表示位置がスムーズに追従していきますが、カメラの静止時も細かく位置や傾きが変動するため、モデルがブレて見えることがあります。

検出のフレームレートはコンテンツの仕様に合わせて調整してください。

## TODO

- 録画機能

- 設定値の分離（jsonファイル？）

## ライセンス
Live2D Cubism Core は Live2D Proprietary Software License で提供しています。
 - Live2D Proprietary Software License 
[日本語](http://www.live2d.com/eula/live2d-proprietary-software-license-agreement_jp.html) 
[English](http://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html) 
   - live2dcubismcore.min.js

Live2D Cubism Components は Live2D Open Software License で提供しています。
- Live2D Open Software License 
[日本語](http://www.live2d.com/eula/live2d-open-software-license-agreement_jp.html) 
[English](http://www.live2d.com/eula/live2d-open-software-license-agreement_en.html) 
   - live2dcubismframework.js
   - live2dcubismpixi.js

Live2D のサンプルモデルは Free Material License で提供しています。
- Free Material License 
[日本語](http://www.live2d.com/eula/live2d-free-material-license-agreement_jp.html) 
[English](http://www.live2d.com/eula/live2d-free-material-license-agreement_en.html) 
   - assets/Koharu/*
   - assets/Haruto/*
   - assets/Hiyori/*

本サンプルの Cubism Core と Cubism Components に含まれないコードは MIT License で提供しています。
 - MIT License
[日本語](https://ja.osdn.net/projects/opensource/wiki/licenses%2FMIT_license)
[English](https://opensource.org/licenses/mit-license.php)
   - pixiAframeAR.js
   - index.html
   - qr_marker.html

直近会計年度の売上高が 1000 万円以上の事業者様がご利用になる場合は、SDKリリース(出版許諾)ライセンスに同意していただく必要がございます。 
- [SDKリリース(出版許諾)ライセンス](http://www.live2d.com/ja/products/releaselicense) 

*All business* users must obtain a Publication License. "Business" means an entity  with the annual gross revenue more than ten million (10,000,000) JPY for the most recent fiscal year.
- [SDK Release (Publication) License](http://www.live2d.com/en/products/releaselicense) 

A-Frame は MIT License で提供されています。
[A-Frame license](https://github.com/aframevr/aframe/blob/master/LICENSE)

AR.js は MIT License で提供されています。
[AR.js license](https://github.com/jeromeetienne/AR.js/blob/master/LICENSE.txt)

PixiJS は MIT License で提供されています。
[PixiJS license](https://github.com/pixijs/pixi.js/blob/dev/LICENSE)

QRコードは(株)デンソーウェーブの登録商標です。

