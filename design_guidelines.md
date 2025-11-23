# Design Guidelines: Premium Marketplace Review & Complaint Manager

## Design Approach

**Reference-Based Approach**: Premium SaaS productivity aesthetic combining:
- **Linear**: Razor-sharp minimalism, surgical information density, subtle depth
- **Notion**: Flexible content organization, clean hierarchy, effortless interaction
- **Asana**: Confident enterprise UI, sophisticated data visualization

**Core Principle**: Create a $1B-caliber interface with maximum information density wrapped in refined, glass-morphic aesthetics. Every pixel serves purpose; every interaction feels premium.

---

## Typography

**Font Stack**: Inter (Google Fonts) exclusively
- Display/Titles: text-3xl font-semibold tracking-tight
- Section Headers: text-xl font-semibold
- Card Titles: text-base font-semibold
- Body: text-sm font-normal leading-relaxed
- Metadata: text-xs font-medium tracking-wide uppercase text-opacity-60
- Numbers/Stats: text-4xl font-bold tabular-nums

**Hierarchy Principle**: Sharp contrast between sizes, generous line-height (1.6 for body), tight tracking on headlines (-0.02em).

---

## Layout System

**Spacing Primitives**: Tailwind units **4, 6, 8, 12, 16, 20, 24**
- Card padding: p-6 standard, p-8 for premium cards
- Section gaps: gap-8 (components), gap-12 (major sections)
- Component spacing: space-y-6
- Micro-spacing: gap-4 for tightly related items

**Dashboard Architecture**:
- Fixed sidebar: w-72 with glass effect, subtle blur backdrop
- Content area: flex-1 with max-w-screen-2xl mx-auto px-8
- Top bar: h-20 with backdrop blur, floating appearance
- Full viewport utilization: min-h-screen with proper overflow handling

---

## Visual Treatment

**Glass-Morphism Foundation**:
- Cards: `backdrop-blur-xl bg-white/80` with `border border-white/20`
- Subtle inner shadows: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]`
- Soft outer glow: `shadow-xl shadow-purple-500/5`
- Layered depth with stacked blur effects

**Premium Surface Patterns**:
- Primary surfaces: Multi-layer glass with gradient borders
- Secondary surfaces: Single-layer translucency
- Interactive elements: Frosted glass intensifies on hover
- Modals: Heavy blur (backdrop-blur-2xl) with vignette effect

---

## Component Library

### Navigation Sidebar
- Glass container with gradient border-right
- Logo lockup at top (h-20 matching top bar)
- Nav groups with dividers (border-t border-white/10)
- Items: Heroicons (outline) + label, px-4 py-3 rounded-lg
- Active state: Frosted background with accent border-l-2
- Hover: Subtle brightness increase, transform scale-[1.02]
- User profile at bottom with avatar, name, role in glass card

### Dashboard Header
- Floating glass bar with page title + live count badge
- Right cluster: Search (w-80 with glass input), filter button, profile
- Search: Glass input with Heroicon magnifying glass, focus ring with glow
- Action button: Premium gradient background, bold text, icon + label

### Stat Cards (KPI Grid)
- Grid: grid-cols-4 gap-6 at top of dashboard
- Glass card with gradient accent border (top or left)
- Large number (text-4xl font-bold) with trend arrow icon
- Label below (text-sm uppercase tracking-wide opacity-60)
- Sparkline chart embedded (subtle line graph, 40px height)
- Hover: Lift with shadow-2xl, slight scale transform

### Review Cards (Main Content)
- Glass container: p-6 rounded-2xl with multi-layer border
- Header: Marketplace badge + timestamp + severity indicator (right-aligned)
- Title: text-base font-semibold, 2-line clamp
- Sentiment row: Icon badge + category tags (glass pills with blur)
- Preview text: text-sm opacity-75, 3-line clamp
- Footer: Action buttons (ghost style) + status dropdown (right)
- Hover state: Elevate with glow, border intensifies
- Grid layout: grid-cols-3 gap-6 (masonry-style heights)

### Kanban Board
- Three columns: Equal width with gap-8
- Column headers: Glass cards with count badge, subtle gradient
- Board container: Full-width with horizontal scroll if needed
- Cards: Condensed review info with drag handle, source icon, assignee avatar
- Drop zones: Dashed border appears on drag, glow effect
- Empty columns: Elegant icon + "No items" with ghost button

### Modal/Detail View
- Full-screen overlay: backdrop-blur-md with dark vignette
- Content container: max-w-4xl glass card with heavy blur
- Header: Source badge, title, close button (icon only, rounded-full)
- Tabs: Glass pills with active state gradient
- Content sections: Generous p-8, proper vertical rhythm
- AI insights: Frosted callout box with icon, bullet points
- Action bar: Sticky bottom with glass background, button cluster

### Charts & Analytics
- Chart containers: Glass cards p-8 rounded-2xl
- Titles: text-lg font-semibold mb-6 with export icon button
- Chart.js integration: Deep blue/purple gradients, smooth curves
- Legend: Below chart with glass pill indicators
- Grid layout: grid-cols-2 gap-8 for comparison charts
- Tooltips: Glass cards with sharp data display

### Forms & Inputs
- Inputs: Glass background, border border-white/20, px-4 py-3 rounded-lg
- Focus: Ring with purple glow, border brightens
- Labels: text-sm font-medium mb-2, subtle opacity
- Textareas: min-h-40 with resize handle
- File upload: Dashed glass border dropzone, icon + helper text centered
- Validation: Inline messages with icon, subtle color indication

### Buttons
- Primary: Gradient background (deep blue to purple), font-semibold, px-6 py-3 rounded-lg
- Secondary: Glass border style, hover brightens background
- Ghost: Transparent with hover glass effect
- Icon buttons: p-2.5 rounded-lg glass background
- Disabled: Reduced opacity, no interaction
- All buttons: Smooth transform on hover (scale-[1.02]), shadow enhancement

### Badges & Pills
- Small glass pills: px-3 py-1 text-xs font-medium rounded-full backdrop-blur
- Severity: Outlined style with icon prefix
- Status: Filled glass with gradient border
- Tags: Multi-select with × remove button
- Source logos: Contained in rounded glass badge (h-6)

### Filter Panel
- Slide-over drawer or dropdown with heavy glass blur
- Checkbox groups with custom styled checkboxes (rounded glass)
- Active filters: Display as removable pills below header
- Date picker: Glass calendar with gradient accents
- "Clear All" button in ghost style

---

## Micro-Interactions

**Purposeful Motion** (subtle, fast):
- Card hover: `transition-all duration-300` with lift (translateY(-2px))
- Button press: `active:scale-95` instant feedback
- Modal entry: Fade + scale from 0.95 to 1.0 in 200ms
- Drag feedback: Opacity + slight rotation on grabbed cards
- Loading: Elegant skeleton screens with shimmer gradient
- Status changes: Smooth color/icon transitions (300ms)

**NO**: Scroll animations, page transitions, decorative animations

---

## Images

**Dashboard Context**: No hero images; this is a productivity tool.

**Asset Strategy**:
- Marketplace logos: Use Font Awesome brand icons or small PNG badges
- Empty states: Minimalist line-art illustrations (single color, geometric)
- User avatars: Circular with gradient backgrounds for initials
- Charts: Chart.js with live data rendering
- Icons: Heroicons exclusively (outline for secondary, solid for primary actions)
- Background: Subtle gradient mesh or noise texture on body (optional ambient detail)

---

## Responsive Behavior

- **Mobile** (<768px): Sidebar → hamburger, single column grids, stacked stats, bottom nav bar
- **Tablet** (768-1024px): grid-cols-2 layouts, compact sidebar (w-20 icon-only)
- **Desktop** (>1024px): Full grid-cols-3/4, expanded sidebar (w-72), maximum density

---

## Accessibility

- WCAG AAA contrast ratios on all text
- Keyboard nav: Focus rings with purple glow (ring-2 ring-purple-400/50)
- Aria labels on icon buttons
- Semantic HTML structure
- Status conveyed through icons + text, not purely visual
- 44×44px minimum touch targets