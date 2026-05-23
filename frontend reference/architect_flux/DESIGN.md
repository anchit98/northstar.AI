---
name: Architect Flux
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#c1c7d3'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#8b919c'
  outline-variant: '#414751'
  surface-tint: '#a2c9ff'
  primary: '#a2c9ff'
  on-primary: '#00315b'
  primary-container: '#5b9fed'
  on-primary-container: '#003560'
  inverse-primary: '#0060a8'
  secondary: '#c9bfff'
  on-secondary: '#2e019b'
  secondary-container: '#462cb1'
  on-secondary-container: '#b7aaff'
  tertiary: '#fbbc00'
  on-tertiary: '#402d00'
  tertiary-container: '#c69400'
  on-tertiary-container: '#443000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#a2c9ff'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#004880'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c9bfff'
  on-secondary-fixed: '#1a0063'
  on-secondary-fixed-variant: '#462cb1'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#fbbc00'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
  surface-default: '#0B0F14'
  surface-raised: '#141A22'
  surface-overlay: '#1C2430'
  border-subtle: rgba(51, 65, 85, 0.12)
  private-workbench: '#907CFF'
  metrics-gold: '#FFBF00'
  success-green: '#10B981'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  metric-display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  rail-width: 72px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for "NorthStar AI," a high-performance platform for builders and executors. The brand personality is rooted in credibility and precision, evoking the feeling of a sophisticated mission-control center rather than a standard SaaS tool. 

The aesthetic follows a **Cinematic Material** style—a refined evolution of Material Design 3. It utilizes a deep, high-contrast dark palette to create a focused "workbench" environment. The visual language balances professional gravity with polished, modern touches like subtle translucency and precise data visualization. The emotional response should be one of empowerment, clarity, and "gated" exclusivity.

## Colors

The palette is anchored in a cinematic dark blue-gray. **Primary Cool Blue** is reserved for public-facing calls to action and global navigation, signaling "action." 

**Muted Purple** is a functional signifier used exclusively for private workbench environments to indicate a "gated" or "authenticated" state, providing a psychological shift for the user. 

**Amber/Gold** serves as the tertiary accent, strictly dedicated to metrics, highlights, and critical achievements. Neutral surfaces use a three-tier system of depth (#0B0F14, #141A22, #1C2430) to create a clear visual hierarchy without relying on heavy shadows.

## Typography

This design system utilizes **Hanken Grotesk** for all UI elements and headlines to provide a geometric, modern, and authoritative feel. **JetBrains Mono** is employed for labels, data points, and metadata to reinforce the "builder" and "executor" theme, lending a technical and precise character to the interface.

- **Headlines:** Bold weights with slightly negative letter-spacing for a compact, cinematic look.
- **Body:** Generous line-height to ensure readability against the dark background.
- **Data/Labels:** Monospaced fonts used for all numerical values and status tags to ensure character alignment and a high-tech aesthetic.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid** model. The primary navigation is a fixed **Navigation Rail** (72px) on the left, providing quick access to top-level domains. 

The content area follows a 12-column grid on desktop with 24px gutters. On mobile, this collapses to a single-column layout with 16px margins. 

Spacing is based on an 8px rhythm. Components should use 16px or 24px padding internal to cards, while layout sections should be separated by 32px or 48px to maintain the "serious and polished" breathing room.

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional physical shadows. 
- **Level 0 (Background):** #0B0F14 (Deepest).
- **Level 1 (Cards/Containers):** #141A22 with a 1px solid border (#334155 at 12% opacity).
- **Level 2 (Modals/Popovers):** #1C2430 with a subtle 8% white overlay for added luminance.

Borders are mandatory for all elevated surfaces to define edges in the high-contrast dark environment. Use extremely diffused, 0-spread shadows only for the highest tier (modals) to separate them from the primary workbench.

## Shapes

The design system follows Material Design 3 shape logic. Standard containers, including cards and input fields, utilize a **12px to 16px corner radius**. 

Actionable elements like buttons and chips are **fully rounded (Pill-shaped)** to provide a clear contrast against the structural, rectangular grid of the "NorthStar AI" dashboard.

## Components

### Buttons & Chips
- **Primary Action:** Pill-shaped, #5B9FED background with dark text. 
- **Private Workbench Action:** Pill-shaped, #907CFF background.
- **Dashed Chips:** Specialized "In-Progress" or "Goal" chips featuring a dashed border using the #FFBF00 (Amber) accent and transparent background.

### Navigation Rail
- A slim 72px vertical bar. Icons use #5B9FED for active states and low-opacity white for inactive. No text labels on the rail unless collapsed.

### Metric Highlight Cards
- Surface: #141A22. 
- Features: Large "Metric-Display" typography in #FFBF00. 
- Footer: A mini-sparkline or monospaced percentage change indicator.

### Inputs & Forms
- Outlined style using #334155 at 20% opacity. On focus, the border transitions to #5B9FED with a subtle outer glow.

### Lists
- Clean rows with 1px dividers. Monospaced font for timestamps or status labels on the right-hand side.