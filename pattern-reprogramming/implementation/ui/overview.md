# FIL Design System: Component Architecture Overview

This document defines the **FIL Design System**. The system, named **FIL**, constitutes the independent and authoritative design language for the project. It serves as the **sole source of truth**, and all design decisions, style implementations, and component architectures must strictly adhere to the specifications defined herein, overriding any other reference materials.

## Design System Foundation

### Design Tokens

```yaml
# tokens.yaml - Single source of truth for FIL design values
colors:
  canvas:
    bg: "#000000"          # Deepest background
    text: "#ffffff"        # Primary text
  panel:
    bg: "#000000"          # Component background
    border: "#333333"      # Subtle separators
    control_bg: "#111111"  # Button/Card backgrounds
    control_bg_hover: "#222222" # Hover state
  text:
    primary: "#ffffff"
    muted: "rgba(255, 255, 255, 0.6)"
    faint: "rgba(255, 255, 255, 0.3)"
  grid:
    line: "rgba(255, 255, 255, 0.12)"

spacing:
  unit: 4px
  section_spacing: "8rem"
  scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 80, 128]

typography:
  fontFamily:
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  fontSize:
    hero: "8vw"      # Responsive H1
    h2: "2rem"
    h3: "1.2rem"
    body: "1rem"
    small: "0.875rem"
  fontWeight:
    thin: 100
    extra_light: 200
    light: 300
    normal: 400
    bold: 500        # Max weight usually 500
  letterSpacing:
    tight: "-0.02em"
    normal: "0em"
    wide: "0.05em"

borderRadius:
  none: "0"
  sm: "4px"          # Subtle, technical corner
  full: "9999px"

shadows:
  none: "none"
  # Shadows are rarely used; rely on contrast/borders
  glow: "0 0 20px rgba(255, 255, 255, 0.1)" 

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
```

### Component Specification Format

Each component follows this deterministic specification, emphasizing the "Technical" aesthetic:

```yaml
# component-spec.yaml
component: Button
category: primitives
aesthetic: technical

props:
  variant:
    type: enum
    values: [primary, outline, ghost]
    default: primary
  size:
    type: enum
    values: [sm, md, lg]
    default: md
  icon:
    type: boolean
    description: "Optional technical icon"

states:
  - default: "Border #333, Bg #111"
  - hover: "Border White, Bg #222, Transform -2px"
  - active: "Bg #333"
  - disabled: "Opacity 0.5"

accessibility:
  role: button
  focus_ring: "1px solid white offset 2px"
```

## Component Architecture

```
src/
├── components/
│   ├── primitives/        # Atomic elements
│   │   ├── Button/
│   │   ├── Typography/    # H1, H2, Standardized Text
│   │   ├── Grid/          # Structural lines/layout
│   │   └── Icon/          # Minimalist SVG icons
│   │
│   ├── modules/           # Functional sections
│   │   ├── ProjectCard/   # .concept-item
│   │   ├── Navigation/    # Mix-blend-mode header
│   │   └── Footer/
│   │
│   └── layouts/           # Page structures
│       ├── MainLayout/    # Handles smooth transitions
│       └── ArchiveLayout/ # Grid-heavy layout
│
├── styles/
│   ├── theme.css          # CSS Variables
│   └── globals.css        # Reset & Typography
```

## Implementation Patterns

### Standard Button (Technical)

```tsx
// components/primitives/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base: Technical, rectangular, subtle radius
  'inline-flex items-center gap-2 px-8 py-4 bg-[#111] text-white border border-[#333] rounded-[4px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#222] hover:border-white',
  {
    variants: {
      variant: {
        primary: '', // Standard defined in base
        ghost: 'bg-transparent border-transparent hover:bg-[#111] hover:border-[#333]',
      },
      size: {
        sm: 'py-2 px-4 text-sm',
        md: 'py-4 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
```

### Motion Primitive (Framer Motion)

Consistent "Slow, Smooth, Elegant" transitions.

```tsx
// components/primitives/Motion/FadeIn.tsx
import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 1.0, 
      ease: "easeInOut",
      delay: delay 
    }}
  >
    {children}
  </motion.div>
);
```

## Accessibility Requirements

- **Contrast**: Maintain strict White on Black (21:1 ratio) for primary text.
- **Mix-Blend-Mode**: Use `difference` mode for fixed navigation to ensure visibility over any underlying media.
- **Focus States**: clear, high-contrast borders for keyboard navigation.

## Decision History

### Aesthetic: "Brutalist-Lite" vs "Standard Corporate"
**Decision**: Brutalist-Lite / Architectural
**Rationale**:
- Fits the "Daito Manabe / Rhizomatiks" brand identity.
- Prioritizes content (art) over UI chrome.
- Uses negative space as a primary layout tool.

### Navigation: Fixed + Mix-Blend-Mode
**Decision**: Use `mix-blend-mode: difference`
**Rationale**:
- Allows the nav to float over complex, dark or light media without needing a solid background.
- Creates a "Technical" feel.
```
