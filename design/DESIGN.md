---
name: 프로젝트 비서 (Project Secretary)
colors:
  surface: '#faf8ff'
  surface-dim: '#cfd9ff'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#ebedff'
  surface-container-high: '#e3e7ff'
  surface-container-highest: '#dbe1ff'
  on-surface: '#243157'
  on-surface-variant: '#515e86'
  inverse-surface: '#070d20'
  inverse-on-surface: '#969cb5'
  outline: '#6d79a4'
  outline-variant: '#a4b0de'
  surface-tint: '#3f5baa'
  primary: '#3f5baa'
  on-primary: '#faf8ff'
  primary-container: '#acbfff'
  on-primary-container: '#163785'
  inverse-primary: '#809aef'
  secondary: '#3c675b'
  on-secondary: '#e4fff4'
  secondary-container: '#ccfbeb'
  on-secondary-container: '#376256'
  tertiary: '#006c52'
  on-tertiary: '#e5fff2'
  tertiary-container: '#7df2c8'
  on-tertiary-container: '#005a43'
  error: '#ac3434'
  on-error: '#fff7f6'
  error-container: '#f56965'
  on-error-container: '#65000b'
  primary-fixed: '#acbfff'
  primary-fixed-dim: '#98b0ff'
  on-primary-fixed: '#002266'
  on-primary-fixed-variant: '#22408f'
  secondary-fixed: '#ccfbeb'
  secondary-fixed-dim: '#beecdd'
  on-secondary-fixed: '#244f44'
  on-secondary-fixed-variant: '#426c60'
  tertiary-fixed: '#7df2c8'
  tertiary-fixed-dim: '#6ee4bb'
  on-tertiary-fixed: '#004533'
  on-tertiary-fixed-variant: '#00644c'
  primary-dim: '#324f9d'
  secondary-dim: '#305b4f'
  tertiary-dim: '#005f47'
  error-dim: '#70030f'
  background: '#faf8ff'
  on-background: '#243157'
  surface-variant: '#dbe1ff'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-padding: 32px
  sidebar-width: 260px
---

## Brand & Style

The design system for "프로젝트 비서" is built on the principles of **Expressive Functionalism**. It prioritizes clarity, focus, and administrative efficiency while incorporating a more sophisticated and vibrant color language. The target audience includes professionals and students who require a structured yet visually engaging environment to manage complex tasks.

The visual style is influenced by modern productivity suites with a touch of character:
- **Expressive Clarity:** Use of a richer color palette to define hierarchy and state.
- **Structured Layers:** High reliance on tonal changes and subtle outlines to define boundaries without clutter.
- **Sophisticated Utility:** A "notational" aesthetic where every element has a clear purpose, enhanced by modern geometric typography.
- **Emotional Response:** The UI should feel motivating, reliable, and "ready to work," transforming the stress of project management into a sense of structured, colorful progress.

## Colors

The palette is anchored in a professional, "Expressive" light environment. 

- **Primary (#5873C4):** A calm, slate-blue used for primary actions, active states, and progress indicators.
- **Secondary (#547F72):** A muted sage-green used for secondary grouping and auxiliary actions.
- **Tertiary (#009975):** A vibrant emerald green used for successful states and growth-oriented tasks.
- **Neutral/Surface (#70768E):** The foundation for text and UI scaffolding, providing a cool-toned, professional legibility.
- **Borders:** Subtle outlines (derived from the neutral tone) replace heavy shadows for structural separation.
- **Text:** Primary text should use the deep neutral tones for high legibility, with secondary information in lighter variants.

## Typography

This design system uses a dual-font approach to balance personality with utility. 

1. **Plus Jakarta Sans** is used for headlines and brand-heavy elements. Its geometric nature adds a friendly, approachable "secretary" feel without losing professionalism.
2. **Inter** is used for all body text, inputs, and data. It is highly legible, neutral, and excels at rendering technical information like dates and task names.

**Korean Language Note:** Ensure that the font weights are balanced; use Medium (500) for body text when the font size is below 14px to maintain readability on standard displays.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid model**. 
- **Sidebar:** A fixed-width left navigation panel (260px) in a light neutral tint with a right-side border.
- **Main Content:** A fluid area with a maximum readable width of 1200px for dashboard views, centered within the viewport.
- **Rhythm:** An 8px grid system governs all spacing.
- **Whitespace:** Use "Generous" padding (24px - 32px) for card containers to prevent the UI from feeling cramped. Elements within cards should use 16px (md) spacing to maintain a compact, functional density.

**Mobile Reflow:** On mobile devices, the sidebar transitions to a hidden "hamburger" menu. Horizontal padding reduces to 16px.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Primary surface color (#F9F9FC).
- **Level 1 (Subtle Containers):** Defined by a 1px border of the outline-variant. No shadow.
- **Level 2 (Interactive Elements/Modals):** Elements that require focus use a very soft, high-diffusion shadow to lift them slightly off the page.
- **Active States:** Subtle tonal shifts in background color denote hovered menu items or selected tasks.

## Shapes

The shape language is consistent and modern. A standard **rounded-lg (0.5rem/8px)** radius is the default for buttons, while containers use a more pronounced **1.5rem (24px)** radius for a "soft" professional look.

- **Cards/Containers:** 24px (`rounded-xl` in this system's scale).
- **Buttons & Inputs:** 8px (`rounded-lg`).
- **Tags/Chips:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid `#5873C4` with white text. 8px corner radius.
- **Secondary:** Outlined or soft-filled using the Secondary teal palette.
- **Ghost:** No background or border. Used for low-priority navigation items.

### Cards
- Soft neutral background, 1px outline border, 24px rounded corners.
- Header sections within cards should be separated by a subtle tonal shift.

### Input Fields
- Background: Light neutral surface.
- Border: 1px outline-variant. On focus, the border changes to Primary Blue with a subtle 2px outer glow.

### Chips & Status Indicators
- Use a "Soft Tag" style: A background color at 10-15% opacity with text in the 100% saturation color.

### Lists
- Tasks are presented in clean rows with 1px bottom borders. 
- Hover state: Change row background to a subtle neutral tint.
- Checkboxes: Large (20px), rounded-square shape. When checked, fill with Primary Blue.

### Additional Components
- **Progress Bar:** Thin track in neutral outline-variant with a solid Primary Blue fill.
- **Empty States:** Use simplified, stroke-based icons in neutral tones with centered text.