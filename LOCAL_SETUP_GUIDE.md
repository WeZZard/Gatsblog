# 🚀 WeZZard Blog - Local Setup Guide

## Overview
This guide will help you set up and run the WeZZard Blog (migrated to Gatsby v5 + TypeScript) on your local computer.

## Prerequisites

### 1. **Node.js** (Required)
- **Version**: Node.js v18.x or v20.x LTS
- **Download**: https://nodejs.org/
- **Verify installation**:
  ```bash
  node --version  # Should show v18.x.x or v20.x.x
  npm --version   # Should show 9.x.x or higher
  ```

### 2. **Git** (Optional but recommended)
- **Download**: https://git-scm.com/
- **Verify**: `git --version`

## Installation Steps

### Step 1: Get the Code
If you have the code as a ZIP file:
```bash
# Extract the ZIP file to a folder
# Navigate to the folder in terminal/command prompt
cd /path/to/wezzard-blog
```

If using Git:
```bash
# Clone the repository (if available)
git clone <repository-url>
cd wezzard-blog
```

### Step 2: Install Dependencies
```bash
# Install all required packages (this may take a few minutes)
npm install

# If you encounter permission errors on Mac/Linux, try:
sudo npm install
```

### Step 3: Verify Installation
```bash
# Check TypeScript compilation
npm run type-check

# Should output: "tsc --noEmit" with no errors
```

## Running the Blog

### Development Mode (Recommended)
```bash
# Start the development server
npm run develop

# Or if you prefer yarn:
yarn develop
```

**What to expect:**
- Gatsby will start compiling (takes 30-60 seconds first time)
- You'll see: `success onPreBootstrap`, `success createPages`, etc.
- When ready: `You can now view wezzard-blog in the browser`
- **Local URL**: http://localhost:8000
- **GraphQL Explorer**: http://localhost:8000/___graphql

### Production Build
```bash
# Build for production
npm run build

# Serve the built site
npm run serve
```

## Troubleshooting Common Issues

### 1. **Node Version Issues**
```bash
# If you have multiple Node versions, use Node Version Manager
# Install nvm: https://github.com/nvm-sh/nvm

# Use the correct Node version
nvm install 20
nvm use 20
```

### 2. **Dependency Installation Errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. **TypeScript Errors**
```bash
# Check for TypeScript issues
npm run type-check

# If errors, they'll be displayed with file locations
```

### 4. **Build Issues**
```bash
# Clear Gatsby cache
npm run clean

# Try building again
npm run build
```

### 5. **Port Already in Use**
```bash
# If port 8000 is busy, Gatsby will automatically use 8001, 8002, etc.
# Or specify a custom port:
npm run develop -- --port 3000
```

## Content Management

### Adding Blog Posts
1. **Location**: Create `.mdx` files in `content/posts/`
2. **Format**: Use this frontmatter structure:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2024-01-01"
   category: "Technology"
   tags: ["TypeScript", "Gatsby"]
   isPublished: true
   ---
   
   Your blog content here...
   ```

### Adding Static Pages
1. **Location**: Create `.mdx` files in `content/pages/`
2. **Example**: `content/pages/about.mdx`

### Configuration
- **Site settings**: Edit `config/site.yml`
- **Navigation**: Edit `config/navigation.yml`

## Project Structure

```
wezzard-blog/
├── content/                 # Blog posts and pages
│   ├── posts/              # Blog posts (.mdx files)
│   ├── pages/              # Static pages (.mdx files)
│   └── config/             # Site configuration
├── src/                    # TypeScript source code
│   ├── components/         # React components
│   ├── templates/          # Page templates
│   ├── types/              # TypeScript definitions
│   ├── core/               # Page generation logic
│   └── styles/             # SCSS styles
├── legacy/                 # Original Gatsby v2 code (reference)
├── docs/                   # Documentation
├── gatsby-config.ts        # Gatsby configuration
├── gatsby-node.ts          # Page generation
└── package.json           # Dependencies and scripts
```

## Available Scripts

```bash
# Development
npm run develop          # Start development server
npm run clean           # Clear Gatsby cache

# Production
npm run build           # Build for production
npm run serve           # Serve production build

# Code Quality
npm run type-check      # TypeScript validation
npm run lint            # Code linting
npm run format          # Code formatting

# Testing
npm test                # Run tests (if available)
```

## Customization

### Styling
- **SCSS files**: Located in `src/styles/`
- **Component styles**: Use CSS modules (`.module.scss`)

### Adding Features
- **New templates**: Add to `src/templates/`
- **New components**: Add to `src/components/`
- **Page generation**: Modify `src/core/create-pages/`

### Configuration
- **Site metadata**: `gatsby-config.ts`
- **TypeScript**: `tsconfig.json`
- **Linting**: `.eslintrc.js`

## Development Tips

### 1. **Hot Reloading**
- Changes to React components reload automatically
- Changes to `gatsby-config.ts` require restart
- Changes to page generation require restart

### 2. **GraphQL Development**
- Visit http://localhost:8000/___graphql
- Explore your site's data structure
- Test queries before using in components

### 3. **TypeScript Benefits**
- Full autocomplete in VS Code
- Catch errors at compile time
- Refactoring support

### 4. **Debugging**
- Use browser dev tools
- Console logs appear in terminal and browser
- TypeScript errors shown in terminal

## Performance Tips

### 1. **Images**
- Place images in `src/images/` or `static/`
- Use Gatsby's image optimization
- Prefer WebP format when possible

### 2. **Build Optimization**
- Run `npm run clean` before important builds
- Use `npm run build` to test production performance

## Getting Help

### Documentation
- **Gatsby v5**: https://www.gatsbyjs.com/docs/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **MDX**: https://mdxjs.com/

### Common Issues
- Check `docs/` folder for migration guides
- Look at `legacy/` folder for original implementation
- TypeScript errors usually have clear error messages

### Community
- Gatsby Discord: https://gatsby.dev/discord
- Stack Overflow: Tag questions with `gatsby` and `typescript`

## Next Steps

1. **Start development**: `npm run develop`
2. **Add your content**: Create posts in `content/posts/`
3. **Customize styling**: Modify SCSS files
4. **Deploy**: Use Netlify, Vercel, or GitHub Pages

## Success Indicators

✅ **Everything working correctly when:**
- `npm run develop` starts without errors
- Site loads at http://localhost:8000
- You can navigate between pages
- TypeScript compilation passes (`npm run type-check`)
- You can create and view new blog posts

## Deployment Ready

Once everything works locally:
- The blog is ready for deployment to any static hosting service
- All modern TypeScript features are available
- Perfect SEO and performance optimization included

Happy blogging! 🎉