# 🚀 Modern Full-Stack Portfolio & Admin CMS

A high-performance, visually stunning developer portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Material-UI (MUI)**, **Framer Motion**, **Animate.css**, **MongoDB (Mongoose)**, and **Firebase Storage**. Features an interactive client portfolio and a full-featured Admin Control Panel for live dynamic content & social link management.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=for-the-badge&logo=mongodb)
![MUI](https://img.shields.io/badge/Material--UI-v5-007FFF?style=for-the-badge&logo=mui)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-v11-f50057?style=for-the-badge&logo=framer)

---

## ✨ Key Features

### 🎨 Client Portfolio Interface
- **Interactive 3D Card Flip**: Work Experience & Personal Projects showcase image posters on the front face, with smooth 3D flip animation to reveal detailed technical descriptions, metrics, and skill chips.
- **Direction-Aware Transitions**: Next/Previous arrows dynamically trigger direction-aware left/right slide transitions powered by Framer Motion.
- **Post-Loading Synchronized Entrance Animations**: Pages (`/about`, `/project`, `/contact`) hide content until page loading overlay completes, then trigger smooth entrance animations (`animate__fadeInUp`, `animate__fadeInLeft`, `animate__fadeInRight`, `animate__fadeInDown`).
- **Interactive Particle Backgrounds**: Custom particle network and triangle mesh effects reacting to user interactions.
- **Smart Link Detection**: GitHub & Live Demo action buttons render only when real links exist.

### 🛠️ Admin Control Panel (CMS)
- **Dynamic Content Management**: Manage Page Titles, Descriptions, Work Experience, Personal Projects, Skills, Certifications, and Education history in real-time.
- **🌐 Dynamic Social & CV Links Management**: Live preview cards and 1-Click Quick Presets for updating GitHub, Facebook, LinkedIn, and CV Drive URLs. Changes instantly reflect across the public portfolio and Header download buttons.
- **Compact Grid & Hover Actions**: Admin project grid displays uniform 2-column cards with a glowing hover `✏️ Edit Project` action button.
- **Firebase Media Uploads**: Integrated image upload and preview for project screenshots and company logos with file validation.

### 🛡️ Multi-Deployment & Security
- **Dual-Mode Admin Protection**: Built-in Middleware (`middleware.ts`) and Environment variable (`NEXT_PUBLIC_ENABLE_ADMIN`) checks.
- **Multi-Host Detection**: Automatically shows 4 icons (including Admin access) on `localhost` or Netlify admin deployments, while displaying only 3 icons (GitHub, Facebook, LinkedIn) and redirecting direct `/admin` routes to Home on public deployments.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Language**: TypeScript
- **Styling & Components**: Material-UI (MUI v5), Custom Vanilla CSS
- **Animations**: Framer Motion, Animate.css, React CountUp
- **Database**: MongoDB with Mongoose ORM
- **Storage**: Firebase Storage (Image assets)
- **Authentication**: JWT Cookie-based Auth
- **Forms & Validation**: Formik & Yup

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas URI)
- Firebase Project for Storage bucket

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/trlamm1505/portfolio.git
cd portfolio
```

Install dependencies:
```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory (do not commit this file):

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Firebase Storage Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Visibility Toggle (true for Admin deployments, false for Public deployments)
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
