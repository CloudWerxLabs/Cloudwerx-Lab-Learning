# SVG Guide

## Introduction to SVG
SVG (Scalable Vector Graphics) is an XML-based vector image format for 2D graphics. This guide covers fundamental to advanced concepts.

## Basic Shapes

### Rectangle
```svg
<svg width="200" height="200">
  <rect x="10" y="10" width="100" height="50"
        fill="blue" stroke="black" stroke-width="2"/>
</svg>
```

### Circle and Ellipse
```svg
<svg width="200" height="200">
  <!-- Circle -->
  <circle cx="100" cy="100" r="50" fill="red"/>
  
  <!-- Ellipse -->
  <ellipse cx="100" cy="100" rx="100" ry="50"
           fill="green"/>
</svg>
```

### Line and Polyline
```svg
<svg width="200" height="200">
  <!-- Line -->
  <line x1="10" y1="10" x2="190" y2="190"
        stroke="black" stroke-width="2"/>
        
  <!-- Polyline -->
  <polyline points="10,10 30,30 50,10"
            fill="none" stroke="black"/>
</svg>
```

### Polygon and Path
```svg
<svg width="200" height="200">
  <!-- Polygon -->
  <polygon points="100,10 40,180 190,60 10,60 160,180"
           fill="purple"/>
           
  <!-- Path -->
  <path d="M10 10 H 90 V 90 H 10 L 10 10"
        fill="none" stroke="black"/>
</svg>
```

## Path Commands

### Move and Line Commands
```svg
<path d="
  M 10 10    <!-- Move to -->
  L 90 90    <!-- Line to -->
  H 10       <!-- Horizontal line -->
  V 10       <!-- Vertical line -->
  Z          <!-- Close path -->
"/>
```

### Curve Commands
```svg
<path d="
  M 10 10
  C 20 20, 40 20, 50 10  <!-- Cubic Bezier -->
  S 80 0, 90 10          <!-- Smooth Cubic -->
  Q 95 20, 100 10        <!-- Quadratic Bezier -->
  T 120 10               <!-- Smooth Quadratic -->
"/>
```

### Arc Command
```svg
<path d="
  M 10 10
  A 20 20 0 0 1 50 50    <!-- Arc -->
"/>
```

## Styling

### Fill and Stroke
```svg
<svg width="200" height="200">
  <rect x="10" y="10" width="100" height="50"
        fill="blue"
        fill-opacity="0.5"
        stroke="black"
        stroke-width="2"
        stroke-dasharray="5,5"/>
</svg>
```

### Gradients
```svg
<svg width="200" height="200">
  <!-- Linear Gradient -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(255,255,0);"/>
      <stop offset="100%" style="stop-color:rgb(255,0,0);"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="100" height="50"
        fill="url(#grad1)"/>
        
  <!-- Radial Gradient -->
  <defs>
    <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgb(255,255,255);"/>
      <stop offset="100%" style="stop-color:rgb(0,0,255);"/>
    </radialGradient>
  </defs>
  <circle cx="150" cy="50" r="40" fill="url(#grad2)"/>
</svg>
```

### Patterns
```svg
<svg width="200" height="200">
  <defs>
    <pattern id="pat1" x="0" y="0" width="20" height="20"
             patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="5" fill="blue"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="100" height="100"
        fill="url(#pat1)"/>
</svg>
```

## Transformations

### Basic Transforms
```svg
<svg width="200" height="200">
  <!-- Translate -->
  <rect transform="translate(50,50)"
        width="20" height="20"/>
        
  <!-- Rotate -->
  <rect transform="rotate(45 100 100)"
        x="90" y="90" width="20" height="20"/>
        
  <!-- Scale -->
  <rect transform="scale(2)"
        x="10" y="10" width="20" height="20"/>
</svg>
```

### Multiple Transforms
```svg
<svg width="200" height="200">
  <rect transform="translate(50,50) rotate(45) scale(2)"
        width="20" height="20"/>
</svg>
```

## Animation

### Basic Animation
```svg
<svg width="200" height="200">
  <circle cx="100" cy="100" r="20">
    <animate attributeName="r"
             values="20;40;20"
             dur="2s"
             repeatCount="indefinite"/>
  </circle>
</svg>
```

### Complex Animation
```svg
<svg width="200" height="200">
  <rect x="10" y="10" width="20" height="20">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 100 100"
      to="360 100 100"
      dur="3s"
      repeatCount="indefinite"/>
  </rect>
</svg>
```

## Filters

### Basic Filters
```svg
<svg width="200" height="200">
  <defs>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
  </defs>
  <rect x="10" y="10" width="100" height="50"
        filter="url(#blur1)"/>
</svg>
```

### Complex Filters
```svg
<svg width="200" height="200">
  <defs>
    <filter id="shadow1">
      <feOffset dx="3" dy="3"/>
      <feGaussianBlur stdDeviation="2"/>
      <feColorMatrix type="matrix"
        values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="10" y="10" width="100" height="50"
        filter="url(#shadow1)"/>
</svg>
```

## Best Practices

### Optimization
1. Use appropriate precision
2. Remove unnecessary attributes
3. Minimize path commands
4. Use symbols for reuse
5. Optimize transforms

### Performance
1. Minimize filter usage
2. Use appropriate viewBox
3. Optimize animations
4. Reduce complexity
5. Use proper sizing

### Accessibility
1. Add title elements
2. Include descriptions
3. Use ARIA labels
4. Maintain contrast
5. Provide alternatives

## Debugging

### Tools
1. Browser DevTools
2. SVG validators
3. Path editors
4. Optimization tools
5. Animation inspectors

### Common Issues
1. Path syntax errors
2. Transform order
3. Viewbox scaling
4. Filter performance
5. Animation timing

Remember: SVG is powerful for scalable graphics. Focus on optimization and accessibility for production use.
