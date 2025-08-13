# AssetWise B2B Partners - Next.js

A Next.js application for AssetWise B2B partner verification and registration system.

## 🚀 Migration Complete

This project has been successfully migrated from Vite + React to Next.js with the following improvements:

### Key Features
- ✅ **Next.js App Router** - Modern routing system
- ✅ **Server-Side Rendering (SSR)** - Better SEO and performance
- ✅ **TypeScript Support** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Custom Thai Font (DBHeavent)** - Preserved original design
- ✅ **API Proxy Configuration** - Seamless API integration
- ✅ **Admin Dashboard** - Protected admin routes
- ✅ **Company Search & Verification** - Partner verification system
- ✅ **Lead Registration Forms** - B2B lead capture

### Tech Stack
- **Framework**: Next.js 15.4+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form integration ready
- **API**: Proxy configuration for external APIs

## 🏗️ Project Structure

```
app/
├── admin/                 # Admin dashboard pages
│   └── page.tsx          # Admin login/dashboard
├── components/           # Reusable React components
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── AlertPopup.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroBanner.tsx
│   ├── Info.tsx
│   └── RegisterLeadForm.tsx
├── hooks/                # Custom React hooks
│   ├── getData.ts        # API data fetching hooks
│   └── saveData.ts       # Data saving utilities
├── utils/                # Utility functions
│   ├── api.ts           # API configuration
│   ├── auth.ts          # Authentication utilities
│   └── types.ts         # TypeScript type definitions
├── assets/              # Static assets
│   ├── fonts/           # Custom font files
│   └── images/          # Image assets
├── globals.css          # Global styles and fonts
├── layout.tsx           # Root layout component
└── page.tsx             # Home page component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Configuration
The app uses API proxy configuration in `next.config.js` to handle CORS and routing:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://aswinno.assetwise.co.th/APIUAT/:path*',
    },
  ];
}
```

### Environment Variables
Create a `.env.local` file for environment-specific variables:

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=https://aswinno.assetwise.co.th/APIUAT
```

## 🔒 Admin Access
- URL: `/admin`
- Default credentials: `admin` / `admin123`
- Session management with automatic expiry

## 🎨 Styling
- **Tailwind CSS** for utility-first styling
- **Custom Thai Font (DBHeavent)** with multiple weights
- **Responsive design** for mobile and desktop
- **Custom color palette** matching brand guidelines

## 📱 Pages & Features

### Home Page (`/`)
- Company search and verification
- Partner registration form
- Information sections
- Responsive hero banner

### Admin Dashboard (`/admin`)
- Protected admin area
- Lead management
- Company verification system
- Session-based authentication

## 🔄 Migration Notes

### What Changed
1. **Routing**: React Router → Next.js App Router
2. **Build System**: Vite → Next.js
3. **File Structure**: `src/` → `app/` directory
4. **Import/Export**: Updated for Next.js conventions
5. **Environment Variables**: Vite env → Next.js env
6. **API Handling**: Added proxy configuration

### What Stayed the Same
- All React components and functionality
- Styling and design system
- API integrations and data flow
- Custom hooks and utilities
- TypeScript configuration

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary to AssetWise.

---

**Migration completed successfully!** 🎉 The application now runs on Next.js with improved performance, SEO, and developer experience.