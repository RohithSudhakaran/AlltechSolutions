# 🏗️ Alltech Solutions - Professional Fabrication Website

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**🌟 Modern, Dynamic, and Professional Website for Fabrication Services**

[🚀 Live Demo](https://alltech-solutions.vercel.app) • [📧 Contact Us](mailto:alltechdummy@gmail.com) • [📖 Documentation](#documentation)

</div>

---

## 🎯 **Project Overview**

Alltech Solutions is a cutting-edge website showcasing professional fabrication services. Built with modern web technologies, it features dynamic animations, responsive design, and a fully functional contact system with email integration.

### ✨ **Key Features**

- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- 📱 **Fully Responsive** - Perfect experience across all devices
- 📧 **Contact Form** - Integrated email system with auto-replies
- ⚡ **Performance Optimized** - Fast loading with Next.js optimization
- 🔒 **Secure** - Environment variables and proper security practices
- 🎭 **Interactive** - Smooth animations and dynamic content

---

## 🛠️ **Technology Stack**

<div align="center">

| Frontend | Backend | Styling | Deployment |
|----------|---------|---------|------------|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | ![Node.js](https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css) | ![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript) | ![API Routes](https://img.shields.io/badge/API_Routes-gray?style=flat-square) | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git) |

</div>

### 📦 **Core Dependencies**

```json
{
  "next": "^15.2.4",
  "react": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "nodemailer": "^6.9.0",
  "lucide-react": "^0.344.0"
}
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0 or higher
- npm or pnpm package manager
- Gmail account with App Password (for email functionality)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/RohithSudhakaran/AlltechSolutions.git

# Navigate to project directory
cd AlltechSolutions

# Install dependencies
npm install
# or
pnpm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
# or
pnpm dev
```

### **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
COMPANY_EMAIL=your-business@gmail.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

> 📝 **Note**: To get Gmail App Password, enable 2-Factor Authentication and generate an App Password in your Google Account settings.

---

## 📁 **Project Structure**

```
alltech-solutions/
├── 📁 app/
│   ├── 📄 layout.tsx          # Root layout component
│   ├── 📄 page.tsx            # Main homepage
│   ├── 📄 globals.css         # Global styles
│   └── 📁 api/
│       └── 📁 contact/
│           └── 📄 route.ts    # Email API endpoint
├── 📁 components/
│   ├── 📄 theme-provider.tsx  # Theme configuration
│   └── 📁 ui/                 # Reusable UI components
├── 📁 lib/
│   └── 📄 utils.ts            # Utility functions
├── 📁 public/                 # Static assets
├── 📄 tailwind.config.ts      # Tailwind configuration
├── 📄 next.config.mjs         # Next.js configuration
└── 📄 package.json            # Dependencies and scripts
```

---

## ⚡ **Features Showcase**

### 🎨 **Dynamic Animations**
- Smooth project statistics counters
- Intersection observer animations
- Professional hover effects

### 📧 **Email System**
- **Contact Form**: Professional form with validation
- **Auto-Reply**: Instant thank you emails to customers
- **Notifications**: Real-time email alerts for new inquiries
- **Error Handling**: Robust error management and logging

### 🏢 **Business Sections**
- **Services**: Comprehensive service listings
- **Projects**: Portfolio showcase with statistics
- **Clients**: Trusted client testimonials
- **About**: Professional company information

---

## 🔧 **Development**

### **Available Scripts**

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Email Testing**

Test email functionality:

```bash
# Test email configuration
curl "http://localhost:3000/api/contact?test=true"

# Test contact form submission
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","message":"Test message"}' \
  http://localhost:3000/api/contact
```

---

## 🚀 **Deployment**

### **Deploy to Vercel**

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables from `.env.local`
3. **Deploy**: Automatic deployment on every push to main branch

### **Environment Variables for Production**

Ensure these are set in your deployment platform:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
COMPANY_EMAIL=your-business@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## 📊 **Performance Metrics**

- ⚡ **Lighthouse Score**: 95+ Performance
- 🎯 **Core Web Vitals**: Excellent
- 📱 **Mobile Friendly**: 100% Responsive
- 🔍 **SEO Optimized**: Meta tags and structured data

---

## 🐛 **Troubleshooting**

### **Common Issues**

| Issue | Solution |
|-------|----------|
| Email not sending | Check Gmail App Password and 2FA setup |
| Environment variables not loading | Ensure `.env.local` is in root directory |
| Build errors | Run `npm run type-check` for TypeScript issues |
| Styling issues | Clear browser cache and restart dev server |

### **Email Setup Guide**

See [EMAIL_FIX_GUIDE.md](./EMAIL_FIX_GUIDE.md) for detailed email configuration instructions.

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💼 **About Alltech Solutions**

**Alltech Solutions** is a leading fabrication company specializing in:

- 🏗️ Pre-Engineered Structures
- 🏠 Roofing Solutions  
- 🚗 Car Parking Solutions
- 🚪 Steel Doors & Windows
- 🔥 Fire Rated Doors
- ⚗️ Chemical Anchoring
- ☂️ Floating Canopies
- 🛡️ Hand Railings (SS & MS)
- 🏢 Interiors & Steel Framings

### 📍 **Location**
Sundarapuram, Coimbatore 641024, Tamil Nadu, India

### 📊 **Company Stats**
- ✅ 500+ Projects Completed
- 🤝 250+ Happy Clients  
- 📅 15+ Years Experience
- ⭐ 5/5 Quality Rating

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/RohithSudhakaran/AlltechSolutions?style=social)](https://github.com/RohithSudhakaran/AlltechSolutions/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/RohithSudhakaran/AlltechSolutions?style=social)](https://github.com/RohithSudhakaran/AlltechSolutions/network/members)

**Made with ❤️ by [Rohith Sudhakaran](https://github.com/RohithSudhakaran)**

</div>

---

<div align="center">

*© 2025 Alltech Solutions. All rights reserved.*

</div>
