# Design Guidelines: Dark Analytics Theme

## Design Approach

**Reference-Based Approach**: Premium dark analytics dashboard inspired by:
- Deep navy/midnight blue background
- Vibrant gradient accent cards (purple to pink to cyan)
- Cyan/teal as the primary accent color
- Clean, data-focused visualizations with yellow and cyan chart colors

**Core Principle**: Create a sophisticated, enterprise-grade dark analytics interface with high contrast, gradient stat cards, and a cohesive dark color palette.

---

## Color Scheme

### Primary Colors
- **Background**: Deep navy blue (`hsl(222, 47%, 6%)`)
- **Card Background**: Slightly elevated navy (`hsl(222, 47%, 9%)`)
- **Sidebar**: Dark navy (`hsl(222, 47%, 8%)`)
- **Primary Accent**: Cyan/teal (`hsl(187, 92%, 53%)`)
- **Text**: Light gray/white (`hsl(210, 40%, 98%)`)
- **Muted Text**: Medium gray (`hsl(215, 20%, 55%)`)
- **Borders**: Subtle dark borders (`hsl(217, 33%, 17%)`)

### Gradient Stat Cards
- **Gradient 1** (Purple to Magenta): `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`
- **Gradient 2** (Pink to Magenta): `linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)`
- **Gradient 3** (Cyan to Teal): `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- **Gradient 4** (Green to Mint): `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`

### Chart Colors
- **Chart 1**: Cyan (`hsl(187, 92%, 53%)`)
- **Chart 2**: Gold/Yellow (`hsl(47, 95%, 53%)`)
- **Chart 3**: Purple (`hsl(280, 87%, 65%)`)
- **Chart 4**: Pink (`hsl(330, 80%, 60%)`)
- **Chart 5**: Green (`hsl(142, 76%, 45%)`)

---

## Typography

**Font Stack**: Inter (Google Fonts) exclusively
- Display/Titles: text-2xl font-semibold tracking-tight
- Section Headers: text-xl font-semibold
- Card Titles: text-base font-semibold
- Body: text-sm font-normal leading-relaxed
- Metadata: text-xs font-medium tracking-wide uppercase
- Numbers/Stats: text-3xl font-bold

---

## Layout System

**Spacing Primitives**: Tailwind units **4, 6, 8, 12, 16, 20, 24**
- Card padding: p-5 to p-6
- Section gaps: gap-6 (components), gap-8 (major sections)
- Component spacing: space-y-6
- Micro-spacing: gap-4 for tightly related items

**Dashboard Architecture**:
- Fixed sidebar: w-64 with dark background and cyan active indicators
- Content area: flex-1 with proper padding (p-6)
- Full viewport utilization: min-h-screen with proper overflow handling

---

## Component Library

### Navigation Sidebar
- Dark navy background
- Logo with DriftSignal branding at top
- Nav items with lucide icons
- Active state: Cyan left-border indicator (border-l-2 border-l-primary)
- Hover: Subtle background elevation
- User profile at bottom with avatar and dropdown menu

### Stat Cards (Gradient KPI Cards)
- Vibrant gradient backgrounds (4 variations)
- White text for maximum contrast
- Large number display (text-3xl font-bold)
- Label at top (text-xs uppercase tracking-wider)
- Optional subtitle below value
- Decorative wave SVG in corner (opacity-20)
- Icon in bottom-right corner (opacity-30)

### Dashboard Header
- Flex layout with title and action buttons
- Buttons use primary color (cyan)
- Search input with dark background

### Review Cards
- Dark card background with subtle border
- Clear hierarchy with title, content preview
- Marketplace badge and sentiment indicators
- Status badges with appropriate colors
- Hover state with subtle elevation

### Charts & Analytics
- Chart containers with dark card backgrounds
- Cyan and yellow/gold as primary chart colors
- Grid lines using border color (subtle)
- Tooltips with popover background styling
- Legend below charts

### Buttons
- Primary: Cyan background with dark text
- Secondary: Dark background with light text
- Ghost: Transparent with subtle hover elevation
- All buttons use the elevate system for hover/active states

### Badges & Pills
- Small pills with appropriate color coding
- Sentiment badges: positive (green), neutral (gray), negative (red)
- Status badges: open (yellow), in_progress (blue), resolved (green)

### Filter Components
- Dark input backgrounds with subtle borders
- Cyan accent on focus states
- Clear visual hierarchy in filter groups

---

## Micro-Interactions

**Purposeful Motion** (subtle, fast):
- Card hover: Subtle elevation increase
- Button press: active:scale-95 instant feedback
- Modal entry: Fade + scale from 0.95 to 1.0 in 200ms
- Loading: Spinner with primary color

---

## Images & Icons

**Asset Strategy**:
- Marketplace logos: Use react-icons/si for brand logos
- Icons: Lucide-react exclusively
- User avatars: Circular with gradient backgrounds for initials
- Charts: Recharts with theme-appropriate colors

---

## Dark Mode Only

This design uses a single dark theme:
- No light/dark toggle needed
- All components designed for dark backgrounds
- High contrast text for readability
- Vibrant accents for visual interest

---

## Responsive Behavior

- **Mobile** (<768px): Sidebar collapses, single column grids
- **Tablet** (768-1024px): grid-cols-2 layouts
- **Desktop** (>1024px): Full grid-cols-3/4, expanded sidebar
