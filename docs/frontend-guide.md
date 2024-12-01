# Frontend Development Guide

## Introduction
Frontend development focuses on creating user interfaces and experiences for web applications. This guide covers essential concepts, frameworks, and best practices.

## HTML Fundamentals

### Semantic HTML
```html
<header>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Main Content</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content here...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2023 Your Company</p>
</footer>
```

### Accessibility
```html
<!-- ARIA roles and labels -->
<button 
  aria-label="Close dialog"
  role="button"
  tabindex="0">
  <span aria-hidden="true">&times;</span>
</button>

<!-- Form accessibility -->
<form>
  <label for="name">Name:</label>
  <input 
    type="text" 
    id="name"
    aria-required="true"
    aria-invalid="false">
</form>
```

## CSS Styling

### Modern Layout
```css
/* Flexbox Layout */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

### Responsive Design
```css
/* Mobile-first approach */
.card {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    width: 33.333%;
  }
}
```

### CSS Variables
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
```

## JavaScript

### Modern JavaScript
```javascript
// Destructuring
const { name, age } = user;

// Spread operator
const newArray = [...oldArray, newItem];

// Arrow functions
const multiply = (a, b) => a * b;

// Async/await
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### DOM Manipulation
```javascript
// Query elements
const element = document.querySelector('.class');
const elements = document.querySelectorAll('.class');

// Event handling
element.addEventListener('click', (e) => {
  e.preventDefault();
  // Handle event
});

// Create elements
const div = document.createElement('div');
div.textContent = 'New content';
parentElement.appendChild(div);
```

## React

### Components
```jsx
// Functional Component
const Button = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className="button">
    {children}
  </button>
);

// Hooks
const Counter = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

### State Management
```jsx
// Context API
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    }
  }
});
```

## TypeScript

### Basic Types
```typescript
// Type definitions
type User = {
  id: number;
  name: string;
  email: string;
  age?: number;
};

// Interface
interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// Generic type
function getFirst<T>(array: T[]): T | undefined {
  return array[0];
}
```

### React with TypeScript
```typescript
interface Props {
  title: string;
  onClick: (id: number) => void;
  children?: React.ReactNode;
}

const Component: React.FC<Props> = ({ 
  title, 
  onClick, 
  children 
}) => {
  return (
    <div onClick={() => onClick(1)}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

## Testing

### Jest
```javascript
describe('Calculator', () => {
  test('adds two numbers', () => {
    expect(add(2, 2)).toBe(4);
  });

  test('subtracts two numbers', () => {
    expect(subtract(4, 2)).toBe(2);
  });
});
```

### React Testing Library
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click increments counter', () => {
  render(<Counter />);
  
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Performance

### Optimization
```javascript
// Code splitting
const LazyComponent = React.lazy(() => 
  import('./LazyComponent')
);

// Memoization
const MemoizedComponent = React.memo(({ value }) => (
  <div>{value}</div>
));

// Virtual list
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={400}
    width={300}
    itemCount={items.length}
    itemSize={50}>
    {({ index, style }) => (
      <div style={style}>{items[index]}</div>
    )}
  </FixedSizeList>
);
```

### Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  // Send metrics to analytics
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## Build Tools

### Webpack Configuration
```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

## Best Practices

### Code Organization
```typescript
// Feature-based structure
src/
  ├── features/
  │   ├── auth/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   └── types.ts
  │   └── products/
  ├── shared/
  │   ├── components/
  │   ├── hooks/
  │   └── utils/
  └── App.tsx
```

### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## Additional Resources

### Documentation
- React Documentation
- TypeScript Handbook
- MDN Web Docs
- CSS Tricks

### Tools
- Chrome DevTools
- React DevTools
- Redux DevTools
- Lighthouse

## Glossary

### Common Terms
- **SPA**: Single Page Application
- **SSR**: Server Side Rendering
- **CSR**: Client Side Rendering
- **SSG**: Static Site Generation
- **JSX**: JavaScript XML
- **Virtual DOM**: DOM abstraction
- **Hooks**: React state/lifecycle
- **Props**: Component properties
