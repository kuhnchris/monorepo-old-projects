# 3box-react-native-example
Example Project demonstrating 3Box integration with native React

# How to get this working:
```
npm install
npm install -g react-native
```
Now for some manual steps:
- Open Android Studio, open the project folder, start virtual machine
- Open node_modules/libp2p-websockets/src/listeners.js, look for `const createServer = require('pull-ws/server') || noop` and remove the `require('...')` part.

Run:
```
react-native run-android
```

and the App should be running!
