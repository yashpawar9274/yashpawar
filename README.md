
# 🚀 Modern Portfolio Website

A dynamic, real-time portfolio website built with React, TypeScript, Tailwind CSS, and Supabase. Features a complete admin dashboard for content management with instant updates across the frontend.

## ✨ Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Content changes reflect instantly without page refresh
- **Dark/Light Theme**: Automatic theme switching with system preference
- **Smooth Animations**: Framer Motion powered animations and transitions
- **ATS-Friendly Resume**: Downloadable PDF resume with portfolio data
- **Social Integration**: GitHub, LinkedIn, Instagram, and email links

### Admin Dashboard
- **Real-time Content Management**: Edit content and see changes instantly
- **Personal Information**: Name, title, contact details, and profile picture
- **About Section**: Professional summary and statistics
- **Projects Management**: Add, edit, delete projects with images and technologies
- **Experience**: Work history with detailed descriptions
- **Education**: Academic background management
- **Certificates**: Professional certifications with verification links
- **Achievements**: Awards and accomplishments with categories

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **PDF Generation**: Built-in ATS-friendly resume generator
- **State Management**: React Query (TanStack Query)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/migrations` folder
   - Update the Supabase configuration in `src/integrations/supabase/client.ts`

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Admin Dashboard: `http://localhost:5173/admin`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Shadcn/UI components
│   ├── admin/           # Admin dashboard components
│   ├── About.tsx        # About section
│   ├── Hero.tsx         # Hero section
│   ├── Projects.tsx     # Projects showcase
│   ├── Experience.tsx   # Work experience
│   ├── Education.tsx    # Education section
│   ├── Certificates.tsx # Certifications
│   ├── Achievements.tsx # Achievements section
│   └── ResumeDownload.tsx # ATS resume generator
├── pages/               # Page components
│   ├── Index.tsx        # Main portfolio page
│   ├── Admin.tsx        # Admin dashboard
│   └── NotFound.tsx     # 404 page
├── integrations/        # External integrations
│   └── supabase/        # Supabase configuration
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

## 🗄️ Database Schema

The application uses the following Supabase tables:

- **personal_info**: Basic information, contact details, profile picture
- **about_info**: Professional summary and statistics
- **projects**: Portfolio projects with technologies and links
- **experiences**: Work experience with descriptions
- **education**: Academic background
- **certificates**: Professional certifications
- **achievements**: Awards and accomplishments

All tables have Row Level Security (RLS) enabled with public access policies for portfolio content.

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Components use Shadcn/UI for consistent design

### Content
- Use the admin dashboard at `/admin` to manage all content
- Changes are reflected in real-time across the frontend
- Upload profile pictures and project images

### Resume Template
- ATS-friendly design with 80%+ compatibility score
- Automatically includes all portfolio data
- Customizable template in `ResumeDownload.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables for Supabase
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Real-time Features

The application uses Supabase real-time subscriptions for:
- Instant content updates across all sections
- Live admin dashboard changes
- Real-time profile picture updates
- Dynamic resume generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the Supabase setup guide

## 🎯 Features Roadmap

- [ ] Blog section with CMS
- [ ] Contact form with email integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Performance monitoring

---

**Built with ❤️ using React, TypeScript, and Supabase**
