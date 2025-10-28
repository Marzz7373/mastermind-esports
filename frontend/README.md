# Mastermind Esports - Vue Frontend

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable Vue components
│   │   ├── Toast.vue           # Toast notification component
│   │   ├── LoadingSpinner.vue  # Loading spinner
│   │   └── SkeletonLoader.vue  # Content placeholder
│   ├── composables/     # Vue composables
│   │   └── useToast.js        # Toast notification system
│   ├── lib/             # Utilities
│   │   └── supabase.js        # Supabase client
│   ├── pages/           # Page components
│   │   ├── Home.vue           # Main shop page
│   │   └── Game.vue           # Game page
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── dist/                # Production build output
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 🎨 Components

### Toast Notifications
Professional notification system with 4 types:

```vue
<script setup>
import { useToast } from '../composables/useToast'

const { success, error, warning, info } = useToast()

// Show notifications
success('Operation completed!')
error('Something went wrong')
warning('Please check your input')
info('Loading data...')
</script>
```

### Loading Spinner
Full-screen or inline loading indicator:

```vue
<LoadingSpinner :fullscreen="true" message="Processing..." />
```

### Skeleton Loader
Content placeholders while loading:

```vue
<SkeletonLoader type="card" />
<SkeletonLoader type="text" />
<SkeletonLoader type="title" />
<SkeletonLoader type="circle" />
```

## 🔧 Configuration

### Supabase Setup
Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🎯 Features

- ✅ Vue 3 with Composition API
- ✅ Vue Router for navigation
- ✅ Supabase integration
- ✅ Toast notifications
- ✅ Loading states
- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ PWA ready

## 📱 Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Styling

Uses scoped CSS with modern features:
- CSS Grid & Flexbox
- CSS Variables for theming
- Smooth animations
- Backdrop filters
- Gradient effects

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates optimized files in `/dist` directory.

### Deploy to:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Any static hosting

## 📄 License

© 2025 Mastermind Esports. All rights reserved.
