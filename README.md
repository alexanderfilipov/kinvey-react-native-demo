# kinvey-react-native-demo

* Setup your dev environment following this article: https://reactnative.dev/docs/environment-setup

* Ensure the reference to `kinvey-react-native-sdk` is up to date in `package.json` file.

* Configure correct Kinvey `appKey` and `appSecret` in `index.js`.

* MIC login with popup browser requires a deeplink scheme to be configured for both ios and android projects. This project is configured with `kinveydemo` scheme. How to configure:

  * iOS: https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app
  * Android: https://developer.android.com/training/app-links/deep-linking
