# Contributing to SnackIQ

Thank you for your interest in contributing to SnackIQ!

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SnackIQ.git
cd SnackIQ

# Install dependencies
npm install
```

### Running the App

**Start on mobile (iOS/Android):**
```bash
npx expo start
```

This will open the Expo developer tools in your terminal. You can then:
- Press `i` to open in iOS Simulator (requires Xcode on macOS)
- Press `a` to open in Android Emulator (requires Android Studio)
- Scan the QR code with the Expo Go app on your physical device

**Start in web browser:**
```bash
npx expo start --web
```

This will open the app in your default web browser.

**Clear cache if needed:**
```bash
npx expo start -c
```

Use this if you encounter issues with cached data or after making configuration changes.

### First Use

1. **Mobile users:** Grant camera permission when prompted to enable barcode scanning
2. **Try the app:**
   - Scan a product barcode, OR
   - Search for "Cheerios" or tap one of the example products
3. **Review the results:**
   - Check the verdict and nutritional analysis
   - Tap highlighted ingredients to learn more about concerns

### Development Requirements

- **Node.js** - Latest version is recommended
- **npm** - Comes with Node.js
- **Expo CLI** - Installed automatically via npx

**For mobile development:**
- **iOS:** macOS with Xcode installed, or iOS device with Expo Go app
- **Android:** Android Studio with emulator configured, or Android device with Expo Go app

**For web development:**
- Any modern web browser (Chrome, Firefox, Safari, Edge)

---

## Questions?

If you have questions about getting started or contributing, feel free to open an issue for discussion.
