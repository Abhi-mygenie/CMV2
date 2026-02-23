# 📱 DinePoints Mobile App - Setup & Testing Guide

## 📋 Overview

The DinePoints mobile application is built using:
- **React Native** with **Expo**
- **Expo Router** for file-based navigation
- **NativeWind** (Tailwind CSS for React Native)
- **Axios** for API calls
- **Async Storage** for local data persistence

---

## 🗂️ Project Structure

```
/app/mobile/
├── app/                      # Expo Router pages (file-based routing)
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.js       # Auth layout wrapper
│   │   ├── login.js         # Login screen
│   │   ├── register.js      # Registration screen
│   │   └── forgot-password.js
│   ├── (tabs)/              # Main app tabs (after login)
│   │   ├── _layout.js       # Tab navigation layout
│   │   ├── index.js         # Dashboard/Home
│   │   ├── customers.js     # Customer management
│   │   ├── transactions.js  # Points & wallet
│   │   └── profile.js       # User profile
│   ├── _layout.js           # Root layout
│   └── index.js             # Entry point (auth check)
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React contexts (AuthContext, etc.)
│   ├── hooks/               # Custom React hooks
│   └── services/            # API service layer
├── .env                     # Environment variables
└── package.json             # Dependencies
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
EXPO_PUBLIC_API_URL=https://loyalty-automation-1.preview.emergentagent.com/api
```

**Note**: The mobile app uses the same backend API as the web application.

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd /app/mobile
yarn install
```

**Status**: ✅ Completed

---

## 📱 Running the Mobile App

### Option 1: Web Browser (Quick Testing)

```bash
cd /app/mobile
yarn web
```

- Opens in browser at `http://localhost:8081`
- Best for quick UI testing
- Limited native features (camera, notifications won't work)

### Option 2: iOS Simulator (Mac Required)

```bash
cd /app/mobile
yarn ios
```

**Requirements**:
- macOS
- Xcode installed
- iOS Simulator configured

### Option 3: Android Emulator

```bash
cd /app/mobile
yarn android
```

**Requirements**:
- Android Studio installed
- Android emulator configured
- SDK tools installed

### Option 4: Physical Device (Recommended for Full Testing)

1. Install **Expo Go** app on your device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```bash
   cd /app/mobile
   yarn start
   ```

3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

---

## 🔑 Demo Account for Testing

Use these credentials to test the mobile app:

**Email**: `demo@restaurant.com`  
**Password**: `Demo@123`

**Pre-loaded Data**:
- 6 customers with varying tiers
- 15+ points transactions
- 10+ wallet transactions
- 5 active coupons
- 3 customer segments
- 8+ feedback entries

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Login with demo credentials
- [ ] Logout functionality
- [ ] "Remember Me" checkbox
- [ ] Password visibility toggle
- [ ] Invalid credentials error handling
- [ ] Registration flow (if applicable)

### Dashboard
- [ ] Total customer count display
- [ ] Recent customers list
- [ ] Quick action buttons
- [ ] Navigation to other screens
- [ ] Data refresh on pull-down

### Customer Management
- [ ] View customer list
- [ ] Search customers
- [ ] Filter by tier (Bronze, Silver, Gold, Platinum)
- [ ] View customer details
- [ ] Add new customer
- [ ] Edit customer information
- [ ] Customer profile view

### Points & Wallet
- [ ] View points transactions
- [ ] Add points to customer
- [ ] Deduct points
- [ ] View wallet transactions
- [ ] Add money to wallet
- [ ] Transaction history

### Coupons
- [ ] View coupon list
- [ ] Create new coupon
- [ ] Edit coupon details
- [ ] Toggle active/inactive
- [ ] View usage statistics

### Segments
- [ ] View customer segments
- [ ] Create new segment
- [ ] View segment details
- [ ] Customer count display

### Feedback
- [ ] View feedback list
- [ ] Submit new feedback
- [ ] Filter by rating
- [ ] View average rating

### QR Code
- [ ] Generate QR code
- [ ] Download QR code
- [ ] Share QR code
- [ ] Scan QR code (camera permission)

### Settings
- [ ] View loyalty settings
- [ ] Update earning rate
- [ ] Configure tier bonuses
- [ ] Set redemption rate

### WhatsApp Integration
- [ ] View templates
- [ ] Create/edit templates
- [ ] View automation rules
- [ ] Configure automation

---

## 🔧 Troubleshooting

### Issue: App won't start

**Solution**:
1. Clear cache:
   ```bash
   cd /app/mobile
   yarn start --clear
   ```
2. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   yarn install
   ```

### Issue: API calls failing

**Verify**:
1. Backend is running: `curl https://loyalty-automation-1.preview.emergentagent.com/api/docs`
2. `.env` file exists and has correct URL
3. Check network connectivity

### Issue: Expo Go can't connect

**Solution**:
1. Ensure phone and computer are on same network
2. Disable VPN
3. Check firewall settings
4. Try tunnel mode: `yarn start --tunnel`

### Issue: Module not found errors

**Solution**:
```bash
cd /app/mobile
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## 🎨 UI/UX Notes

### Navigation Structure

The app uses **Expo Router** for file-based routing:

```
app/
├── index.js              → Redirects to login or tabs
├── (auth)/
│   └── login.js         → /login
└── (tabs)/
    ├── index.js         → / (Dashboard)
    ├── customers.js     → /customers
    └── transactions.js  → /transactions
```

### Styling

- **NativeWind** (Tailwind for React Native)
- Uses Tailwind class names: `className="flex-1 bg-white"`
- Responsive design for different screen sizes

### Icons

- **lucide-react-native** for icons
- Consistent icon set across the app

---

## 📊 API Integration

The mobile app connects to the same backend as the web app.

**Base URL**: `https://loyalty-automation-1.preview.emergentagent.com/api`

**Key Endpoints**:
- `POST /auth/login` - User authentication
- `GET /customers` - Fetch customers
- `POST /customers` - Add new customer
- `GET /points/transactions` - Get points history
- `POST /points/add` - Add points
- `GET /coupons` - Fetch coupons
- `GET /segments` - Get customer segments
- `GET /feedback` - Fetch feedback

**Authentication**:
- JWT token stored in **SecureStore**
- Included in Authorization header: `Bearer {token}`

---

## 🔐 Security Features

1. **Secure Storage**: JWT tokens stored using `expo-secure-store`
2. **Session Management**: Auto-logout on token expiration
3. **Protected Routes**: Auth guard on all protected screens
4. **Input Validation**: Client-side validation for forms
5. **Secure API Calls**: HTTPS only

---

## 📱 Native Features Used

- ✅ **Camera**: QR code scanning
- ✅ **Image Picker**: Customer profile photos
- ✅ **Push Notifications**: Loyalty updates
- ✅ **Secure Storage**: Token persistence
- ✅ **Device Info**: Device identification
- ✅ **Async Storage**: Local data caching

---

## 🚀 Deployment (Future)

### iOS App Store
1. Build production app: `eas build --platform ios`
2. Submit to TestFlight
3. Review and publish to App Store

### Google Play Store
1. Build production APK: `eas build --platform android`
2. Upload to Play Console
3. Submit for review

**Note**: Requires **Expo Application Services (EAS)** account.

---

## 📝 Testing Status

| Component | Status | Notes |
|-----------|--------|-------|
| Dependencies | ✅ Installed | All packages installed successfully |
| Configuration | ✅ Complete | `.env` file configured |
| Backend Connection | ✅ Ready | API URL configured |
| Web Version | ⏳ To Test | Can run on `localhost:8081` |
| iOS Testing | ⏳ Pending | Requires Mac + Xcode |
| Android Testing | ⏳ Pending | Requires emulator/device |
| Physical Device | ⏳ Pending | Requires Expo Go app |

---

## 🎯 Next Steps

1. **Test on Web Browser**: Quick validation of UI and login flow
2. **Test on Physical Device**: Full native feature testing
3. **Verify Camera**: QR code scanning functionality
4. **Test Offline Mode**: Async storage and caching
5. **Performance Testing**: Load time and responsiveness
6. **Push Notifications**: Configure and test
7. **Build Production**: Create APK/IPA for distribution

---

## 💡 Tips for Testing

1. **Use Demo Account**: Always start with `demo@restaurant.com` / `Demo@123`
2. **Check Network Tab**: Monitor API calls in Expo DevTools
3. **Test Offline**: Enable airplane mode to test caching
4. **Different Screen Sizes**: Test on various devices
5. **Gestures**: Verify swipe, pinch, long-press interactions
6. **Orientation**: Test portrait and landscape modes
7. **Performance**: Monitor FPS and memory usage

---

## 📞 Support

For issues or questions:
1. Check Expo documentation: https://docs.expo.dev
2. React Native docs: https://reactnative.dev
3. Troubleshoot with: `npx expo-doctor`

---

*Generated by Emergent E1 Agent*  
*Mobile App Version: 1.0.0*  
*Last Updated: February 23, 2026*
