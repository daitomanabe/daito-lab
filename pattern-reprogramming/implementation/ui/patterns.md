# FIL Design System: UI Implementation Patterns

This document defines reusable UI patterns, interaction behaviors, and component composition strategies for implementations of the **FIL Design System**.

## Content Display Patterns

### Project Layout (Grid System)

A strict grid system with visible or invisible lines to create structure.

```yaml
component: ProjectGrid
aesthetic: architectural

layout:
  desktop:
    columns: "repeat(auto-fit, minmax(300px, 1fr))"
    gap: "2rem"
    border: "Optional 1px solid #222 between items"
  mobile:
    columns: "1fr"
    gap: "1rem"

item_behavior:
  hover:
    - Background: "#111"
    - Border: "White"
    - Transform: "translateY(-5px)"
    - Transition: "0.3s ease"
```

### Concept Card Pattern

Used for listing projects, ideas, or archive items.

```tsx
// components/patterns/ConceptCard.tsx
export const ConceptCard = ({ title, description, date }: CardProps) => (
  <div className="group border border-[#333] p-8 transition-all duration-300 hover:bg-[#111] hover:border-white hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4 opacity-50 text-xs font-mono group-hover:opacity-100">
      <span>{date}</span>
      <span>FIL-ARCHIVE</span>
    </div>
    
    <h3 className="text-xl font-normal mb-2 text-white group-hover:text-white">
      {title}
    </h3>
    
    <p className="text-[#999] font-light leading-relaxed text-sm group-hover:text-[#ccc]">
      {description}
    </p>
  </div>
);
```

## Navigation Patterns

### Minimalist Desktop Navigation

```yaml
component: NavBar
position: fixed top
blend_mode: difference

structure:
  left: "Logo / Brand Name (Bold)"
  right: "Simple Links (No decoration)"

interaction:
  hover: "Subtle underline or opacity change (0.7 -> 1.0)"
```

## Modal & Overlay Patterns

### Image Detail View

For viewing high-res project images or diagrams.

```yaml
behavior:
  backdrop: "rgba(0,0,0, 0.9)" # High opacity black
  animation: "Simple Fade In (0.3s)"
  close: "Click outside or Escape"

layout:
  image: "Max height 90vh, Max width 90vw, object-contain"
  caption: "Absolute bottom left, monospace, small text"
```

## Animation Specifications

### Page Transitions

Slow, cinematic fades between routes.

```yaml
transition:
  enter: 
    opacity: "0 -> 1"
    duration: "1.0s"
    ease: "easeInOut"
  exit:
    opacity: "1 -> 0"
    duration: "0.5s"
```

### Staggered List Loading

When loading a list of items (e.g., search results):

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
```

## Responsive Behavior Patterns

### Typographic Scaling

Handling the massive `8vw` Hero text.

```yaml
h1_hero:
  mobile: 
    size: "12vw" # Larger proportional size for impact
    weight: "100"
    line_height: "1.1"
  desktop:
    size: "8vw"
    weight: "100"
    letter_spacing: "-0.02em"
```

### Grid Adaptation

```yaml
layout:
  grid_cols:
    desktop: 12
    tablet: 6
    mobile: 2
```

## Decision History & Trade-offs

### Image Aspect Ratios
**Decision**: Preserve original aspect ratios with `object-fit: contain` or simple consistent crops.
**Rationale**:
- Artwork integrity is paramount.
- "Masonry" or variable height grids are preferred over uniform square crops for diverse content.

### Scroll Performance
**Decision**: Native scrolling over "Smooth Scroll Jacking"
**Rationale**:
- Better accessibility and predictability.
- Custom smooth scroll libraries often conflict with complex animation orchestration (GSAP/Framer).
- "Smoothness" is achieved via CSS `scroll-behavior: smooth` if needed, but standard physics are preferred for "Technical" feel.
```
