---
name: Kubar Heritage & Horizon
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3d4947'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#924628'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e3d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
The design system is built on the principles of **Premium Minimalism** and **Natural Clarity**. It is designed for travelers seeking authentic cultural experiences in Kutai Barat. The UI acts as a silent frame for high-quality destination photography, emphasizing breathtaking landscapes and vibrant Dayak culture.

The style avoids trendy visual effects in favor of a timeless, "editorial" digital aesthetic inspired by high-end travel journals. It utilizes generous whitespace to reduce cognitive load and large-scale imagery to evoke an immediate emotional connection with the destination. The interface is dependable, organized, and inviting.

## Colors
The palette is rooted in the natural environment of East Kalimantan. 

- **Primary (Teal):** Used for primary actions, active navigation states, and key brand moments. It represents the rivers and rainforests of Kutai Barat.
- **Secondary (Amber):** Used sparingly as an accent for highlights, ratings, and "book now" urgency. It reflects traditional gold craft and sunsets.
- **Neutrals:** A range of slate grays are used for typography to ensure high legibility against the stark white background.
- **Background:** Pure white is the default to maintain a clean, airy, and premium feel.

## Typography
Since "Instrument Sans" was requested but is not in the standard library, **Plus Jakarta Sans** is selected as the optimal substitute. It provides a modern, geometric, and clean feel that perfectly matches the "Airbnb/Tripadvisor" aesthetic.

- **Headlines:** Use Bold and SemiBold weights with tighter letter-spacing for a confident, editorial look.
- **Body:** Use Regular weight with generous line-height to ensure maximum readability for long-form travel guides.
- **Labels:** Used for buttons and navigation; these should always be clear and high-contrast.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid grid**. Content is contained within a 1280px max-width wrapper on desktop to prevent line lengths from becoming unreadable.

- **Grid:** 12-column grid on desktop, 4-column on mobile.
- **Vertical Rhythm:** Use a base-8 spacing system. Section headers should have 64px (stack-xl) of top margin to provide visual breathing room.
- **Photography:** Full-width bleeds are encouraged for hero sections. Gallery layouts should use consistent 16px gutters to maintain an organized feel.

## Elevation & Depth
This design system uses **Ambient Shadows** to create a sense of organized layers without clutter.

- **Level 1 (Cards):** Very soft, highly diffused shadow (Y: 4px, Blur: 20px, Opacity: 5% Black). No border.
- **Level 2 (Hover/Modals):** Slightly deeper shadow (Y: 10px, Blur: 30px, Opacity: 10% Black) to indicate interactivity.
- **Tonal Separation:** Use `#F9FAFB` (Surface Muted) for secondary sections (like filters or footers) to distinguish them from the primary content areas without using lines.

## Shapes
The shape language is friendly and sophisticated. While the base roundedness is set to `2` (0.5rem), the premium travel aesthetic requires larger radii for container-level elements.

- **Primary UI Components:** (Buttons, Inputs) 8px radius.
- **Large Components:** (Cards, Images, Modals) 24px radius to achieve the "Airbnb-style" softness.
- **Selection States:** Use a pill shape (full radius) for tags and categories to distinguish them from functional buttons.

## Components

- **Buttons:** 
  - **Primary:** Solid Teal background, White text, SemiBold. 
  - **Secondary:** White background, Teal border (1px), Teal text.
  - No gradients; flat colors only.
- **Cards:** 
  - Image-first approach. The image should occupy 60-70% of the card area. 
  - 24px corner radius on the container and the top corners of the image.
  - Text inside cards uses `headline-sm` for titles and `caption` for metadata (e.g., "Kutai Barat • 4.8 km").
- **Search Bar:** Large, floating white bar with `Level 2` shadow. Integrated icons should be thin-stroke (2pt) to maintain the minimalist feel.
- **Chips/Filters:** Pill-shaped, light gray background (`#F3F4F6`), switching to Primary Teal with White text when active.
- **Inputs:** Understated 1px border in Light Gray. On focus, the border transitions to Primary Teal with a subtle outer glow.
- **Progressive Disclosure:** Use clean accordions for "Travel Tips" or "History" sections to keep the initial view uncluttered.