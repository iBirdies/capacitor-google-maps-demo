# Demo Google Maps

This demo app makes use of [our custom fork of the Capacitor plugin for Google Maps](https://github.com/LaravelFreelancerNL/capacitor-google-maps/tree/v6-tile-overlay) to show a map with a tile overlay and the user's current location.

## Getting Started

### Pre-requisites

- [Node.js (>=20)](https://nodejs.org/en/download)
- [pnpm (>=8)](https://pnpm.io/installation#using-npm)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli#install-the-ionic-cli)
- [Xcode](https://developer.apple.com/xcode/)
- [CocoaPods](https://cocoapods.org/)
- [Android Studio](https://developer.android.com/studio)

### Building

```bash
# Clone
git clone --recursive https://github.com/LaravelFreelancerNL/capacitor-google-maps-demo.git

# Setup dotenv
cd capacitor-google-maps-demo
cp .env.example .env # Fill all values in .env

# Install dependencies
pnpm install

# Build plugin
pnpm run build-plugin

# Build app
pnpm run build
```

### Running

```bash
pnpm run run:web
pnpm run run:ios
pnpm run run:android
```

### Helpful scripts

```bash
# Open native projects
pnpm run open:ios
pnpm run open:android
```
