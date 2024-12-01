# Next.js Guide

## Introduction to Next.js
Next.js is a React framework that enables features like server-side rendering and static site generation. This guide covers fundamental to advanced concepts.

## Project Setup

### Creating a New Project
```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### Project Structure
```
my-app/
  ├── app/          # App router directory
  ├── components/   # React components
  ├── public/       # Static files
  ├── styles/       # CSS files
  ├── next.config.js
  └── package.json
```

## Routing

### App Router (Next.js 13+)
```typescript
// app/page.tsx - Home page
export default function Home() {
  return <h1>Home Page</h1>
}

// app/about/page.tsx - About page
export default function About() {
  return <h1>About Page</h1>
}
```

### Dynamic Routes
```typescript
// app/posts/[id]/page.tsx
export default function Post({ params }: { params: { id: string } }) {
  return <h1>Post {params.id}</h1>
}
```

### Route Groups
```
app/
  ├── (marketing)/
  │   ├── about/
  │   └── contact/
  └── (shop)/
      ├── products/
      └── cart/
```

## Data Fetching

### Server Components
```typescript
// Default server component
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{/* Use data */}</main>
}
```

### Client Components
```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Static Data Fetching
```typescript
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}
```

## Rendering

### Server-Side Rendering (SSR)
```typescript
// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await getData()
  return <div>{/* render data */}</div>
}
```

### Static Site Generation (SSG)
```typescript
// Force static rendering
export const dynamic = 'force-static'

export default function Page() {
  return <div>Static Content</div>
}
```

### Incremental Static Regeneration (ISR)
```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  return res.json()
}
```

## Styling

### CSS Modules
```typescript
// styles/header.module.css
.header {
  background: #000;
  color: white;
}

// components/Header.tsx
import styles from './header.module.css'

export default function Header() {
  return <header className={styles.header}>...</header>
}
```

### Global CSS
```typescript
// app/globals.css
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### CSS-in-JS
```typescript
'use client'

import styled from 'styled-components'

const Button = styled.button`
  background: blue;
  color: white;
`
```

## Optimization

### Image Optimization
```typescript
import Image from 'next/image'

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={300}
      priority
    />
  )
}
```

### Font Optimization
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Metadata
```typescript
export const metadata = {
  title: 'My App',
  description: 'My app description'
}
```

## API Routes

### API Handlers
```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({ data })
}
```

### Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check auth, redirect, modify headers, etc.
  return NextResponse.next()
}
```

## Environment Variables

### Configuration
```
# .env.local
DATABASE_URL=postgresql://...
API_KEY=your_api_key
```

### Usage
```typescript
// Access in server components/API routes
const dbUrl = process.env.DATABASE_URL

// Access in client components
const apiKey = process.env.NEXT_PUBLIC_API_KEY
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Start production server
npm start
```

### Static Export
```typescript
// next.config.js
module.exports = {
  output: 'export'
}
```

## Testing

### Unit Testing
```typescript
// __tests__/Home.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

### E2E Testing
```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/My App/)
})
```

## Best Practices

### Performance
1. Use server components by default
2. Implement proper caching strategies
3. Optimize images and fonts
4. Minimize client-side JavaScript
5. Use proper loading states

### Security
1. Validate API inputs
2. Implement proper authentication
3. Use CORS policies
4. Secure environment variables
5. Keep dependencies updated

### SEO
1. Use semantic HTML
2. Implement proper metadata
3. Create a sitemap
4. Use proper heading hierarchy
5. Optimize loading performance

## Debugging

### Development Tools
1. React Developer Tools
2. Chrome DevTools
3. Next.js Debug Mode
4. Network Tab
5. Performance Profiler

### Common Issues
1. Hydration errors
2. Build errors
3. API route issues
4. Styling conflicts
5. Route conflicts

Remember: Next.js is powerful but requires understanding of React fundamentals. Focus on server components and proper data fetching patterns for optimal performance.
