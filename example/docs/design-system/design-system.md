# Design System -- TechFlow Landing Page

## Token Format
DTCG ($value/$type)

## Design Language
- Brand personality: professional, trustworthy, modern
- Visual density: spacious (landing page with generous whitespace)
- Color philosophy: analogous blue palette with warm accent for CTAs

## Platform Strategy
- Target platforms: Web
- Responsive approach: Mobile-first

## Typography
- Primary font family: Inter, system-ui, sans-serif
- Type scale: defined in tokens.json typography section
- Hierarchy: large bold headings, comfortable body text, generous line-height for readability

## Color Palette
- Primary (slate-900 #0f172a): Main headings, hero background gradient anchor -- conveys authority and professionalism
- Primary-light (slate-700 #334155): Gradient endpoint, secondary text on dark backgrounds
- Accent (blue-600 #2563eb): CTA buttons, interactive elements, links -- draws attention to conversion points
- Accent-hover (blue-700 #1d4ed8): Hover/active state for accent elements
- Accent-focus (blue-500 #3b82f6): Focus ring color for accessibility
- Surface (slate-50 #f8fafc): Card backgrounds, alternating section backgrounds
- On-surface (slate-900 #0f172a): Primary text on light backgrounds
- On-surface-muted (slate-600 #475569): Secondary/supporting text
- On-primary (white #ffffff): Text on dark backgrounds
- On-primary-muted (slate-300 #cbd5e1): Secondary text on dark backgrounds
- Background (white #ffffff): Page and section backgrounds
- Semantic: success #16a34a, warning #d97706, error #dc2626, info #2563eb

## Component Guidelines
- Naming convention: PascalCase components, camelCase props
- Composition pattern: compound components for complex UI, flat for simple sections
- State coverage: hover, focus-visible, active, disabled, loading, error, empty
- Cards: rounded-xl with subtle shadow, hover lift effect
- Buttons: rounded-lg, min touch target 44x44px, clear focus ring

## Spacing System
- Base unit: 4px grid (Tailwind v4 default --spacing: 4px)
- Scale: xs=4px, sm=8px, md=16px, lg=24px, xl=32px, 2xl=48px, 3xl=64px

## Responsive Breakpoints
### Web
- sm: 640px (small tablets)
- md: 768px (tablets, 2-column layouts begin)
- lg: 1024px (desktop, full layouts)
- xl: 1280px (wide desktop, max-width containers)

### Section Padding Strategy
- Mobile: px-4 (16px) horizontal, py-16 (64px) vertical
- Tablet (md): px-6 (24px) horizontal, py-20 (80px) vertical
- Desktop (lg): px-8 (32px) horizontal, py-24 (96px) vertical

### Typography Scaling
- h1: text-3xl (30px) mobile -> text-4xl (36px) md -> text-5xl (48px) lg -> text-6xl (60px) xl
- h2: text-2xl (24px) mobile -> text-3xl (30px) md -> text-4xl (36px) lg
- body: text-base (16px) mobile -> text-lg (18px) md
- body-large: text-lg (18px) mobile -> text-xl (20px) md

## Interaction States
- Hover: subtle color shift (e.g., blue-600 -> blue-700 for buttons)
- Focus-visible: 2px ring with offset, using accent-focus color
- Active: slight scale reduction (scale-[0.98]) for tactile feedback
- Disabled: opacity-50, cursor-not-allowed
- Card hover: translateY(-2px) + shadow increase for lift effect

## Accessibility
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text (WCAG 2.1 AA)
- Focus indicators: visible ring on all interactive elements via focus-visible
- Touch targets: minimum 44x44px on mobile
- Semantic HTML: section, h1-h3, button, nav, main
- Motion: respect prefers-reduced-motion
