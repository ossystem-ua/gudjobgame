Для сборки приложения необходимо установить
ANDROID SDK
Ant
node
npm
cordova (npm i cordova -g)
python
pip
fabric (pip install fabric)

После этого сборка осуществляется командой
fab prepare_client_app

Затем поменять код и номер версии в client/app/platform/android/AndroidManifest.xml
Потом из папки client/app/platform/android выполнить
./cordova/build --release

Теперь в client/app/platform/android/build/outputs/apk лежат версии для arm и x86 подготовленные к релизу