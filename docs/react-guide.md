# React Guide

## Introduction to React
React is a JavaScript library for building user interfaces. This guide covers fundamental to advanced concepts.

## Components

### Functional Components
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// Arrow function syntax
const Welcome = ({ name }) => {
  return <h1>Hello, {name}</h1>
}
```

### Class Components
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

## Props

### Basic Props
```jsx
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Age: {age}</p>
    </div>
  )
}

// Usage
<Welcome name="John" age={25} />
```

### PropTypes
```jsx
import PropTypes from 'prop-types'

function User({ name, age }) {
  return <div>{name} is {age}</div>
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
}
```

### Default Props
```jsx
function Button({ type = 'primary', children }) {
  return <button className={type}>{children}</button>
}

// Or using defaultProps
Button.defaultProps = {
  type: 'primary'
}
```

## Hooks

### useState
```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### useEffect
```jsx
import { useEffect, useState } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [userId])

  return user ? <div>{user.name}</div> : <div>Loading...</div>
}
```

### useContext
```jsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Themed Button</button>
}
```

### useReducer
```jsx
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  )
}
```

### Custom Hooks
```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = value => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
```

## State Management

### Context API
```jsx
import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
```

### Redux Integration
```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1
    }
  }
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})
```

## Forms

### Controlled Components
```jsx
function Form() {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Form Libraries
```jsx
import { useForm } from 'react-hook-form'

function Form() {
  const { register, handleSubmit, errors } = useForm()
  
  const onSubmit = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>This field is required</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Performance

### React.memo
```jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>
})
```

### useMemo
```jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

### useCallback
```jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b],
)
```

## Styling

### CSS Modules
```jsx
import styles from './Button.module.css'

function Button() {
  return <button className={styles.primary}>Click me</button>
}
```

### Styled Components
```jsx
import styled from 'styled-components'

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  color: ${props => props.primary ? 'white' : 'black'};
`
```

### CSS-in-JS
```jsx
const styles = {
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px'
  }
}

function Button() {
  return <button style={styles.button}>Click me</button>
}
```

## Testing

### Jest and React Testing Library
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

test('counter increments when clicked', () => {
  render(<Counter />)
  const button = screen.getByRole('button')
  fireEvent.click(button)
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### Snapshot Testing
```jsx
import renderer from 'react-test-renderer'

test('Component renders correctly', () => {
  const tree = renderer.create(<MyComponent />).toJSON()
  expect(tree).toMatchSnapshot()
})
```

## Error Handling

### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
```

## Best Practices

### Component Organization
1. Keep components small and focused
2. Use proper file structure
3. Implement proper prop validation
4. Follow naming conventions
5. Use proper component composition

### Performance
1. Use proper memoization
2. Implement code splitting
3. Optimize re-renders
4. Lazy load components
5. Use proper key props

### Security
1. Sanitize user input
2. Prevent XSS attacks
3. Use proper authentication
4. Implement proper CORS
5. Keep dependencies updated

## Debugging

### Tools
1. React Developer Tools
2. Redux DevTools
3. Chrome DevTools
4. Error Boundaries
5. Console logging

### Common Issues
1. State management problems
2. Prop drilling
3. Re-render issues
4. Memory leaks
5. Hook dependencies

Remember: React is declarative and component-based. Focus on proper state management and component composition for maintainable applications.
