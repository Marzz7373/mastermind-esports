# 🎮 Mastermind Esports - Professional Gaming Top-Up Platform

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![PWA](https://img.shields.io/badge/PWA-enabled-green)

Malaysia's premier platform for PUBG UC and Mobile Legends Diamond top-ups with instant delivery and secure payment processing.

## ✨ Features

### 🚀 Core Features
- ⚡ **Instant Delivery** - Most orders completed within 5-15 minutes
- 💳 **Multiple Payment Methods** - DuitNow QR, Touch 'n Go, GrabPay, FPX
- 🔒 **Secure Transactions** - SSL encrypted, no password required
- 💰 **Wallet System** - Fast checkout with pre-loaded balance
- 🎁 **Loyalty Rewards** - RM5 OFF on 5th top-up

### 🌟 Professional Enhancements
- 📱 **Progressive Web App** - Install as mobile/desktop app
- 🔔 **Toast Notifications** - Professional user feedback system
- 💫 **Smooth Animations** - Modern micro-interactions
- 🌐 **Offline Support** - Service worker caching
- 📊 **Loading States** - Better perceived performance
- ♿ **Accessibility** - WCAG 2.1 compliant

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Vue 3** - Reactive framework for admin panel
- **Vite** - Fast build tool

### Backend & Services
- **Supabase** - Authentication & database
- **Google Apps Script** - Payment processing
- **WhatsApp Business API** - Customer communication

### PWA Technologies
- **Service Worker** - Offline caching
- **Web App Manifest** - Install capabilities
- **Cache API** - Asset storage

## 📁 Project Structure

```
mastermind-esports/
├── index.html              # Main landing page
├── style.css              # Global styles & animations
├── script.js              # Core functionality
├── manifest.json          # PWA configuration
├── sw.js                  # Service worker
├── offline.html           # Offline fallback page
├── account.html           # User account page
├── wallet.html            # Wallet management
├── terms.html             # Terms of service
├── frontend/              # Vue.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── composables/   # Vue composables
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
│   └── dist/              # Production build
└── IMPROVEMENTS.md        # Detailed changelog
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for Vue frontend)
- Modern web browser
- (Optional) Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mastermind-esports
```

2. **Main Website (No build required)**
- Open `index.html` in a browser
- Or use a local server:
```bash
npx serve .
```

3. **Vue Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Configuration

1. **Update API endpoint** in `script.js`:
```javascript
const API_URL = "your-google-apps-script-url";
```

2. **Configure Supabase** (Vue frontend):
Create `/frontend/.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 💻 Development

### Main Website
```bash
# No build step - edit HTML/CSS/JS directly
# Test PWA features with HTTPS or localhost
```

### Vue Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📦 Deployment

### Static Hosting (Main Site)
Deploy to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Firebase Hosting**

### Build Vue Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### PWA Requirements
- HTTPS required for PWA features
- Service worker needs HTTPS or localhost
- Icons: 192x192 and 512x512 PNG

## 🎨 Customization

### Colors (CSS Variables)
```css
:root {
  --color-dark-bg: #0C0F2C;
  --color-primary-accent: #FFB300;
  --color-success: #00ffcc;
  /* Edit in style.css */
}
```

### Package Data
Edit package arrays in `script.js`:
```javascript
const pubgPackages = [
  { uc: '325 UC', price: 'RM22' },
  // Add more...
];
```

## 📱 PWA Features

### Install Prompt
- Appears 5 seconds after page load
- Can be dismissed permanently
- Custom styled notification

### Offline Support
- Cached pages load instantly
- Assets available offline
- Graceful degradation

### Add to Home Screen
- Mobile: "Add to Home Screen"
- Desktop: Install icon in address bar
- Chrome, Edge, Safari supported

## 🔧 Browser Support

| Browser | Version | PWA Support |
|---------|---------|-------------|
| Chrome  | 90+     | ✅ Full     |
| Firefox | 88+     | ⚠️ Limited  |
| Safari  | 14+     | ✅ iOS/Mac  |
| Edge    | 90+     | ✅ Full     |

## 🎯 Key Improvements

1. **Toast Notifications** - Replaced all alerts
2. **Loading States** - Better UX during async operations
3. **PWA Support** - Install as app
4. **Smooth Animations** - Professional micro-interactions
5. **Error Handling** - Descriptive, user-friendly messages
6. **Accessibility** - Keyboard navigation, ARIA labels
7. **Mobile Optimization** - Touch-friendly, responsive
8. **Performance** - Lazy loading, caching, optimization

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed changelog.

## 📞 Support

- **WhatsApp**: +60147433177
- **Instagram**: @MastermindEshop
- **Telegram**: @MastermindEsports_bot

## 📄 License

© 2020-2025 Mastermind Esports. All rights reserved.

## 🙏 Acknowledgments

- Google Fonts (Inter)
- Supabase
- Vue.js Team
- Vite

---

Built with ❤️ for Malaysian gamers 🎮
