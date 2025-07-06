# WeZZard Blog - Feature Documentation

## Overview

WeZZard Blog is a static blog system built with Gatsby.js that provides a rich content management experience with MDX support, mathematical formulas, code highlighting, and comprehensive SEO features.

## Core Features

### 1. Content Management
- **MDX-based posts**: Blog posts written in MDX format with frontmatter metadata
- **Post metadata**: Title, subtitle, tags, categories, creation time, license, keywords
- **Multi-language support**: Configurable site language with locale handling
- **Content organization**: Posts stored in `content/_posts/` directory
- **Draft system**: Posts with `isPublished` flag for draft management

### 2. Site Structure
- **Homepage**: Paginated list of blog post excerpts
- **Individual post pages**: Full post content with navigation to previous/next posts
- **Category pages**: Posts grouped by category with pagination
- **Tag pages**: Posts grouped by tags with pagination
- **Page types**: Support for both posts and static pages

### 3. Content Rendering
- **MDX components**: Custom React components for enhanced content rendering
- **Mathematical formulas**: KaTeX integration for inline and block math
- **Code highlighting**: Syntax highlighting for code blocks with Prism.js
- **Image handling**: Responsive images with gatsby-image
- **Custom elements**: Checkboxes, figures, blockquotes, and more

### 4. Navigation & UX
- **Pagination**: Configurable items per page for different content types
- **Post navigation**: Previous/next post links on individual posts
- **Responsive design**: Mobile-first responsive layout
- **Dark/light theme**: Theme support with user preferences
- **Table of contents**: Automatic TOC generation from headings

### 5. SEO & Social
- **Meta tags**: Comprehensive meta tag generation
- **Open Graph**: Social media sharing optimization
- **RSS feed**: Automatic RSS feed generation
- **Sitemap**: XML sitemap generation
- **Robots.txt**: Search engine crawling configuration

### 6. Technical Features
- **Static generation**: Full static site generation with Gatsby
- **GraphQL**: Content querying with Gatsby's GraphQL layer
- **Asset optimization**: Image optimization and lazy loading
- **Performance**: Optimized builds with code splitting
- **PWA features**: Service worker and offline support

## Configuration

### Site Configuration (`config/config.yml`)
```yaml
site:
  title: "Site Title"
  owner: "Site Owner"
  url: "https://example.com"
  lang: "en-US"
  description: "Site description"
  keywords: ["keyword1", "keyword2"]
  license: "cc4.0-by-nc-nd"
  
  indexing:
    - name: Tags
      isEnabled: true
    - name: Categories
      isEnabled: false

navigation:
  createsNavigationItemsForCategories: false
  customNavigationItems:
    - name: "Profile"
      slug: "/profile"
      weight: 0

social:
  - name: "GitHub"
    icon: "fontawesome://fab/github"
    link: "https://github.com/username"

pagination:
  - indexName: "Home"
    itemsPerPage: 8
  - indexName: "Categories"
    itemsPerPage: 8
```

### Post Frontmatter
```yaml
---
title: "Post Title"
subtitle: "Post Subtitle"
createdTime: "2023-01-01T00:00:00.000Z"
category: "Category Name"
tags: ["tag1", "tag2"]
keywords: ["keyword1", "keyword2"]
license: "cc4.0-by-nc-nd"
isPublished: true
---
```

## Content Types

### Posts
- Located in `content/_posts/`
- MDX format with frontmatter
- Support for mathematical formulas using KaTeX
- Code blocks with syntax highlighting
- Custom MDX components

### Pages
- Static pages in `content/` directory
- Same MDX support as posts
- Custom page templates

### Categories
- Automatically generated from post metadata
- Individual category pages with post listings
- Configurable in navigation

### Tags
- Automatically generated from post metadata
- Individual tag pages with post listings
- Tag cloud functionality

## Component Architecture

### Templates
- `Post.js`: Individual blog post template
- `Index.js`: Homepage and listing pages template
- `Page.js`: Static page template
- `Taxonomies.js`: Category/tag listing template

### MDX Components
- Custom rendering for all HTML elements
- Mathematical formula components (InlineMath, MathBlock)
- Code highlighting components (CodeBlock, InlineCode)
- Media components (Image, Picture, Figure)
- Typography components (Heading, Paragraph, Strong)
- Interactive components (Checkbox, Anchor)

### Layout Components
- `Main.js`: Main layout wrapper with SEO
- `NavigationBar.js`: Site navigation
- `SEO.js`: Meta tags and SEO optimization
- `Paginator.js`: Pagination controls

## Build System

### Page Generation
- Dynamic page creation for posts, categories, tags
- Pagination for listing pages
- Previous/next post relationships
- Internationalization support

### Asset Processing
- Image optimization with gatsby-image
- CSS modules for component styling
- SCSS support with custom variables
- Font loading optimization

### Performance Optimization
- Static site generation
- Code splitting
- Lazy loading
- Service worker for caching

## Dependencies (Current)
- Gatsby v2.1.27
- React 16.8.4
- gatsby-mdx for MDX support
- KaTeX for mathematical formulas
- Prism.js for code highlighting
- styled-components for styling
- FontAwesome for icons

## Testing
- Jest for unit testing
- React Testing Library
- Component snapshot testing
- Build verification tests