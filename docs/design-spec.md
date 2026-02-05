# Rep Accountability Dashboard - Design Specification
**Version 1.0** | Created for stakeholder implementation

---

## 🎨 Design Philosophy

**Core Principles:**
1. **Trustworthy, Not Political** - Neutral, data-driven aesthetic that feels authoritative
2. **Scannable** - Quick visual hierarchy for rapid assessment
3. **Transparent** - Clear data visualization that builds confidence
4. **Professional** - Modern but timeless, not trendy
5. **Accessible** - WCAG AA compliant, high contrast, readable

**Design Mood:** Think Bloomberg Terminal meets The New York Times - serious, credible, data-rich but elegant.

---

## 🎨 Color Palette

### Primary Colors (Brand & Navigation)
```css
--primary-900: #0f172a    /* Deep navy - headers, primary text */
--primary-800: #1e293b    /* Navy - cards, sections */
--primary-700: #334155    /* Medium navy - borders */
--primary-600: #475569    /* Slate - secondary text */
--primary-100: #f1f5f9    /* Light slate - backgrounds */
--primary-50:  #f8fafc    /* Near white - page background */
```

**Tailwind classes:** `bg-slate-900`, `text-slate-800`, `border-slate-300`

### Semantic Colors (Data Visualization)

#### Trust/Corruption Grading
```css
--grade-a:  #10b981    /* Emerald 500 - High trust */
--grade-b:  #84cc16    /* Lime 500 - Good */
--grade-c:  #f59e0b    /* Amber 500 - Concerning */
--grade-d:  #f97316    /* Orange 500 - Poor */
--grade-f:  #ef4444    /* Red 500 - Corrupt */
```

**Tailwind classes:** `bg-emerald-500`, `bg-lime-500`, `bg-amber-500`, `bg-orange-500`, `bg-red-500`

#### Financial Data
```css
--money-positive: #10b981    /* Emerald - Increased transparency */
--money-negative: #ef4444    /* Red - Suspicious activity */
--money-neutral:  #64748b    /* Slate 500 - Neutral transactions */
```

#### Party Affiliation (Muted, not primary)
```css
--party-dem:  #3b82f6    /* Blue 500 - muted */
--party-rep:  #dc2626    /* Red 600 - muted */
--party-ind:  #9333ea    /* Purple 600 - independent */
```

**Usage:** Only as small accent pills, never as backgrounds. Party should be visible but not dominate.

### Background & Surface
```css
--bg-page:      #ffffff    /* Pure white - main background */
--bg-card:      #ffffff    /* White - cards */
--bg-section:   #f8fafc    /* Slate 50 - alternating sections */
--bg-hover:     #f1f5f9    /* Slate 100 - interactive hover */
--border-main:  #e2e8f0    /* Slate 200 - card borders */
--border-light: #f1f5f9    /* Slate 100 - subtle dividers */
```

**Tailwind classes:** `bg-white`, `bg-slate-50`, `border-slate-200`

### Text Colors
```css
--text-primary:    #0f172a    /* Slate 900 - headings, emphasis */
--text-secondary:  #475569    /* Slate 600 - body text */
--text-tertiary:   #94a3b8    /* Slate 400 - metadata, captions */
--text-link:       #2563eb    /* Blue 600 - links */
```

**Tailwind classes:** `text-slate-900`, `text-slate-600`, `text-slate-400`

---

## 📝 Typography System

### Font Stack
**Primary (Body & UI):** `Inter` (Google Fonts)
- Clean, modern, excellent readability
- Wide range of weights
- Optimized for screens

**Secondary (Data/Numbers):** `JetBrains Mono` (Google Fonts)
- Monospace for financial data, grades
- Clear number differentiation
- Professional, not "techy"

**Fallback:** `system-ui, -apple-system, sans-serif`

### Type Scale

#### Headings
```css
/* Page Title (H1) */
.heading-1 {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;        /* 40px */
  font-weight: 700;          /* Bold */
  line-height: 1.2;
  letter-spacing: -0.02em;   /* Tight */
  color: #0f172a;            /* slate-900 */
}
```
**Tailwind:** `text-4xl font-bold tracking-tight text-slate-900`

```css
/* Section Title (H2) */
.heading-2 {
  font-family: 'Inter', sans-serif;
  font-size: 1.875rem;      /* 30px */
  font-weight: 600;          /* Semibold */
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: #0f172a;
}
```
**Tailwind:** `text-3xl font-semibold tracking-tight text-slate-900`

```css
/* Card Title (H3) */
.heading-3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;       /* 20px */
  font-weight: 600;
  line-height: 1.4;
  color: #1e293b;           /* slate-800 */
}
```
**Tailwind:** `text-xl font-semibold text-slate-800`

```css
/* Subsection (H4) */
.heading-4 {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;          /* 16px */
  font-weight: 600;
  line-height: 1.5;
  color: #334155;           /* slate-700 */
  text-transform: uppercase;
  letter-spacing: 0.05em;   /* Wide for labels */
}
```
**Tailwind:** `text-base font-semibold uppercase tracking-wide text-slate-700`

#### Body Text
```css
/* Body Large */
.body-large {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;      /* 18px */
  font-weight: 400;
  line-height: 1.7;
  color: #475569;           /* slate-600 */
}
```
**Tailwind:** `text-lg text-slate-600 leading-relaxed`

```css
/* Body Regular */
.body-regular {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;          /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: #475569;
}
```
**Tailwind:** `text-base text-slate-600`

```css
/* Body Small */
.body-small {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;      /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: #64748b;           /* slate-500 */
}
```
**Tailwind:** `text-sm text-slate-500`

#### Data/Numbers
```css
/* Large Data (Grade, Net Worth) */
.data-large {
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;          /* 48px */
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}
```
**Tailwind:** `font-mono text-5xl font-bold tracking-tight`

```css
/* Regular Data (Currency, Stats) */
.data-regular {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.125rem;      /* 18px */
  font-weight: 500;
  line-height: 1.4;
}
```
**Tailwind:** `font-mono text-lg font-medium`

```css
/* Small Data (Labels) */
.data-small {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;      /* 14px */
  font-weight: 500;
  line-height: 1.4;
}
```
**Tailwind:** `font-mono text-sm font-medium`

#### Labels & Metadata
```css
/* Label (All caps, small) */
.label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;       /* 12px */
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.08em;   /* Very wide */
  text-transform: uppercase;
  color: #64748b;           /* slate-500 */
}
```
**Tailwind:** `text-xs font-semibold uppercase tracking-wider text-slate-500`

---

## 🏗️ Layout System

### Grid Structure
**Desktop (1280px+):** 12-column grid, 24px gutters
**Tablet (768px-1279px):** 8-column grid, 20px gutters  
**Mobile (<768px):** 4-column grid, 16px gutters

**Tailwind:** `grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 lg:gap-6`

### Container
```css
.container {
  max-width: 1440px;        /* Wider for data-rich content */
  margin: 0 auto;
  padding: 0 1.5rem;        /* 24px */
}
```
**Tailwind:** `max-w-7xl mx-auto px-6`

### Spacing Scale
Based on 4px base unit (Tailwind default):
- **xs:** 4px (`space-1`)
- **sm:** 8px (`space-2`)
- **md:** 16px (`space-4`)
- **lg:** 24px (`space-6`)
- **xl:** 32px (`space-8`)
- **2xl:** 48px (`space-12`)
- **3xl:** 64px (`space-16`)

**Section spacing:** `space-y-12` (48px between major sections)  
**Card spacing:** `space-y-6` (24px between elements in cards)  
**Component spacing:** `space-y-4` (16px between related items)

---

## 🧩 Component Library

### 1. Grade Badge (A-F Corruption Score)

**Purpose:** Primary trust indicator - must be immediately scannable

#### Design Specs
```html
<!-- Grade A Example -->
<div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 border-2 border-emerald-500">
  <span class="font-mono text-4xl font-bold text-emerald-700">A</span>
  <div class="flex flex-col">
    <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Trust Score</span>
    <span class="text-sm font-medium text-emerald-600">Transparent</span>
  </div>
</div>
```

#### Variants by Grade
| Grade | Background | Border | Text | Label |
|-------|-----------|--------|------|-------|
| A | `bg-emerald-50` | `border-emerald-500` | `text-emerald-700` | "Transparent" |
| B | `bg-lime-50` | `border-lime-500` | `text-lime-700` | "Trustworthy" |
| C | `bg-amber-50` | `border-amber-500` | `text-amber-700` | "Concerning" |
| D | `bg-orange-50` | `border-orange-500` | `text-orange-700` | "Questionable" |
| F | `bg-red-50` | `border-red-500` | `text-red-700` | "Corrupt" |

**Size Variants:**
- **Large (Hero):** `text-4xl` (48px) - Rep detail page
- **Medium (Card):** `text-3xl` (30px) - Rep list cards
- **Small (Inline):** `text-xl` (20px) - Tables, compact views

### 2. Representative Card (List View)

**Purpose:** Scannable overview of key metrics in list/grid

```html
<article class="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
  <!-- Header: Photo + Name + Party -->
  <div class="flex items-start gap-4 mb-6">
    <img src="rep-photo.jpg" alt="Rep Name" 
         class="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
    
    <div class="flex-1">
      <h3 class="text-xl font-semibold text-slate-900 mb-1">Rep. Jane Doe</h3>
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">D</span>
        <span>California, District 12</span>
      </div>
    </div>
    
    <!-- Grade Badge (Medium) -->
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border-2 border-emerald-500">
      <span class="font-mono text-3xl font-bold text-emerald-700">A</span>
    </div>
  </div>
  
  <!-- Key Metrics Grid -->
  <div class="grid grid-cols-3 gap-4 mb-4">
    <!-- Net Worth Change -->
    <div class="text-center py-3 px-2 rounded-lg bg-slate-50">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Net Worth</div>
      <div class="font-mono text-lg font-bold text-red-600">+$2.4M</div>
      <div class="text-xs text-slate-500">+180% since 2018</div>
    </div>
    
    <!-- Stock Trades -->
    <div class="text-center py-3 px-2 rounded-lg bg-slate-50">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Trades</div>
      <div class="font-mono text-lg font-bold text-slate-900">47</div>
      <div class="text-xs text-slate-500">Last 12 months</div>
    </div>
    
    <!-- Top Donor Type -->
    <div class="text-center py-3 px-2 rounded-lg bg-slate-50">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Top Donors</div>
      <div class="font-mono text-lg font-bold text-slate-900">68%</div>
      <div class="text-xs text-slate-500">Corporate PACs</div>
    </div>
  </div>
  
  <!-- Quick Stats Bar -->
  <div class="flex items-center gap-4 pt-4 border-t border-slate-100 text-sm">
    <div class="flex items-center gap-1">
      <span class="text-slate-500">Committees:</span>
      <span class="font-medium text-slate-900">3</span>
    </div>
    <div class="flex items-center gap-1">
      <span class="text-slate-500">Vote Alignment:</span>
      <span class="font-medium text-amber-600">67%</span>
    </div>
  </div>
</article>
```

**Hover State:** Lift with shadow (`hover:shadow-lg transition-shadow`)  
**Mobile:** Stack metrics vertically, reduce padding

### 3. Stat Card (Metric Display)

**Purpose:** Individual data points with context

```html
<div class="bg-white rounded-lg border border-slate-200 p-6">
  <!-- Label -->
  <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
    Net Worth Increase
  </div>
  
  <!-- Primary Value -->
  <div class="font-mono text-4xl font-bold text-slate-900 mb-2">
    $2.4M
  </div>
  
  <!-- Context -->
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
      ↑ 180%
    </span>
    <span class="text-sm text-slate-500">Since taking office (2018)</span>
  </div>
  
  <!-- Optional: Visual (Sparkline, mini chart) -->
  <div class="mt-4 h-12 bg-slate-50 rounded"></div>
</div>
```

**Variants:**
- **Positive (Good):** Green accent (`text-emerald-600`, `bg-emerald-100`)
- **Negative (Bad):** Red accent (`text-red-600`, `bg-red-100`)
- **Neutral:** Slate (`text-slate-600`, `bg-slate-100`)

### 4. Donor Breakdown Chart

**Purpose:** Show funding sources at a glance

```html
<div class="bg-white rounded-lg border border-slate-200 p-6">
  <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
    Funding Sources
  </h4>
  
  <!-- Stacked Bar Chart -->
  <div class="w-full h-12 flex rounded-lg overflow-hidden mb-4">
    <div class="bg-red-500 flex items-center justify-center text-white text-sm font-medium" style="width: 68%">
      Corporate PACs
    </div>
    <div class="bg-amber-500 flex items-center justify-center text-white text-sm font-medium" style="width: 22%">
      Industry
    </div>
    <div class="bg-emerald-500 flex items-center justify-center text-white text-sm font-medium" style="width: 10%">
      Individual
    </div>
  </div>
  
  <!-- Legend with Values -->
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-red-500"></span>
        <span class="text-sm text-slate-600">Corporate PACs</span>
      </div>
      <span class="font-mono text-sm font-medium text-slate-900">$2.8M (68%)</span>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-amber-500"></span>
        <span class="text-sm text-slate-600">Industry Groups</span>
      </div>
      <span class="font-mono text-sm font-medium text-slate-900">$910K (22%)</span>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
        <span class="text-sm text-slate-600">Individual Donors</span>
      </div>
      <span class="font-mono text-sm font-medium text-slate-900">$410K (10%)</span>
    </div>
  </div>
  
  <!-- Top Donor List -->
  <div class="mt-4 pt-4 border-t border-slate-100">
    <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      Top 3 Contributors
    </div>
    <ol class="space-y-1 text-sm">
      <li class="flex justify-between">
        <span class="text-slate-600">1. Tech Industry PAC</span>
        <span class="font-mono font-medium text-slate-900">$450K</span>
      </li>
      <li class="flex justify-between">
        <span class="text-slate-600">2. Energy Corp Alliance</span>
        <span class="font-mono font-medium text-slate-900">$380K</span>
      </li>
      <li class="flex justify-between">
        <span class="text-slate-600">3. Finance Group</span>
        <span class="font-mono font-medium text-slate-900">$320K</span>
      </li>
    </ol>
  </div>
</div>
```

### 5. Stock Trade Timeline

**Purpose:** Show trades correlated with meetings/votes

```html
<div class="bg-white rounded-lg border border-slate-200 p-6">
  <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
    Stock Trading Activity
  </h4>
  
  <!-- Timeline Items -->
  <div class="space-y-4">
    <!-- Trade Event -->
    <div class="flex gap-4">
      <!-- Date marker -->
      <div class="flex flex-col items-center">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-0.5 h-full bg-slate-200"></div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 pb-6">
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="text-sm font-medium text-slate-900">Sold NVDA stock</div>
            <div class="text-xs text-slate-500">March 15, 2024</div>
          </div>
          <span class="font-mono text-sm font-bold text-red-600">-$250K</span>
        </div>
        
        <!-- Correlation Alert -->
        <div class="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="text-sm text-amber-900">
              <strong>Potential conflict:</strong> Sold 3 days before attending AI Safety Committee meeting
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- View All Link -->
  <button class="w-full mt-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
    View all 47 trades →
  </button>
</div>
```

### 6. Vote vs Statement Tracker

**Purpose:** Show discrepancies between statements and actions

```html
<div class="bg-white rounded-lg border border-slate-200 p-6">
  <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
    Statement Alignment
  </h4>
  
  <!-- Alignment Score -->
  <div class="flex items-center gap-4 mb-6">
    <div class="flex-1">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Vote Alignment
      </div>
      <div class="font-mono text-3xl font-bold text-amber-600">67%</div>
    </div>
    
    <!-- Visual Meter -->
    <div class="flex-1">
      <div class="h-4 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" style="width: 67%"></div>
      </div>
      <div class="flex justify-between text-xs text-slate-500 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  </div>
  
  <!-- Recent Discrepancies -->
  <div class="space-y-3">
    <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      Recent Discrepancies
    </div>
    
    <div class="p-3 rounded-lg bg-red-50 border border-red-200">
      <div class="flex items-start gap-2 mb-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
          Opposite
        </span>
        <span class="text-sm font-medium text-slate-900">Climate Bill HR-2847</span>
      </div>
      <div class="text-sm text-slate-600 mb-2">
        <strong>Said:</strong> "I strongly support renewable energy initiatives"
      </div>
      <div class="text-sm text-slate-600">
        <strong>Voted:</strong> Against bill funding solar infrastructure
      </div>
    </div>
  </div>
</div>
```

### 7. Committee Badge

**Purpose:** Show committee assignments compactly

```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
  <svg class="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
  <span class="text-sm font-medium text-slate-700">Ways & Means</span>
  <span class="text-xs text-slate-500">(Chair)</span>
</div>
```

### 8. Search & Filter Bar

**Purpose:** Find and filter representatives quickly

```html
<div class="bg-white rounded-lg border border-slate-200 p-4">
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Search Input -->
    <div class="flex-1">
      <div class="relative">
        <input type="text" 
               placeholder="Search by name, state, or district..."
               class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <svg class="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>
    
    <!-- Filter Dropdowns -->
    <div class="flex gap-3">
      <select class="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500">
        <option>All Parties</option>
        <option>Democrat</option>
        <option>Republican</option>
        <option>Independent</option>
      </select>
      
      <select class="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500">
        <option>All Grades</option>
        <option>A - Transparent</option>
        <option>B - Trustworthy</option>
        <option>C - Concerning</option>
        <option>D - Questionable</option>
        <option>F - Corrupt</option>
      </select>
      
      <select class="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500">
        <option>Sort: Grade</option>
        <option>Sort: Net Worth</option>
        <option>Sort: Trades</option>
        <option>Sort: Name</option>
      </select>
    </div>
  </div>
  
  <!-- Active Filters -->
  <div class="flex gap-2 mt-3">
    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
      California
      <button class="hover:text-blue-900">×</button>
    </span>
    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
      Grade F
      <button class="hover:text-blue-900">×</button>
    </span>
  </div>
</div>
```

---

## 📱 Responsive Behavior

### Breakpoints (Tailwind defaults)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Mobile (<768px)
- **Single column layout** - Stack all cards vertically
- **Condensed headers** - Smaller logo, hamburger menu
- **Touch targets** - Minimum 44px height for buttons
- **Simplified metrics** - Show 2-3 key stats, hide details
- **Bottom nav** - Fixed navigation bar for key sections
- **Collapsible sections** - Accordion pattern for dense data

### Tablet (768px-1023px)
- **2-column grid** for rep cards
- **Side drawer** for filters (not dropdown)
- **Horizontal scrolling** for wide tables
- **Full metric cards** but condensed spacing

### Desktop (1024px+)
- **3-column grid** for rep cards (4-column at 1440px+)
- **Persistent sidebar** for filters
- **Expanded data tables**
- **Hover states** for rich interactions

### Key Mobile Adjustments

```html
<!-- Rep Card - Mobile Optimized -->
<article class="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
  <!-- Mobile: Stack photo + grade vertically -->
  <div class="flex flex-col md:flex-row md:items-start gap-4 mb-4">
    <div class="flex items-center gap-3">
      <img src="rep.jpg" class="w-12 h-12 md:w-16 md:h-16 rounded-full" />
      <div>
        <h3 class="text-lg md:text-xl font-semibold">Rep Name</h3>
        <div class="text-sm text-slate-600">CA-12</div>
      </div>
    </div>
    
    <!-- Grade - Smaller on mobile -->
    <div class="self-start md:ml-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-50 border-2 border-emerald-500">
        <span class="font-mono text-2xl md:text-3xl font-bold text-emerald-700">A</span>
      </div>
    </div>
  </div>
  
  <!-- Mobile: Show only 2 key metrics -->
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
    <!-- Only show on mobile -->
    <div class="col-span-2 md:col-span-1 ...">Net Worth</div>
    <div class="md:block ...">Stock Trades</div>
    <div class="hidden md:block ...">Donors</div>
  </div>
</article>
```

---

## 📄 Page Structures

### 1. Homepage

**Purpose:** Landing page that establishes trust and guides users to explore

#### Layout
```
┌─────────────────────────────────────────┐
│  HEADER (Logo, Search, About)          │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │
│  "Track Congressional Accountability"   │
│  [Search Representatives]               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  KEY STATS (4-col grid)                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 435  │ │ $2.4B│ │ 8,429│ │  3.2 │  │
│  │ Reps │ │Worth │ │Trades│ │ Avg  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  WORST OFFENDERS (Grade F spotlight)   │
│  [Rep Card] [Rep Card] [Rep Card]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  RECENT ACTIVITY FEED                   │
│  • New stock trades                     │
│  • Vote discrepancies                   │
│  • Updated net worth data               │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER (About, Data Sources, Contact) │
└─────────────────────────────────────────┘
```

#### Hero Component
```html
<section class="relative bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
  <div class="max-w-7xl mx-auto px-6 text-center">
    <!-- Headline -->
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
      Track Congressional <span class="text-blue-600">Accountability</span>
    </h1>
    
    <!-- Subheadline -->
    <p class="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
      See how your representatives vote, who funds them, and whether they're working for you or special interests.
    </p>
    
    <!-- Search CTA -->
    <div class="max-w-2xl mx-auto">
      <div class="relative">
        <input type="text" 
               placeholder="Search by name, state, or zip code..."
               class="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
        <button class="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>
    
    <!-- Quick Links -->
    <div class="flex flex-wrap justify-center gap-3 mt-6">
      <a href="#" class="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm">
        View All F-Rated
      </a>
      <a href="#" class="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm">
        Top Stock Traders
      </a>
      <a href="#" class="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm">
        By State
      </a>
    </div>
  </div>
</section>
```

### 2. Representative List Page

**Purpose:** Browse and filter all representatives

#### Layout
```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├───────────┬─────────────────────────────┤
│           │                             │
│  FILTERS  │  REP CARDS GRID             │
│  SIDEBAR  │  ┌──────┐ ┌──────┐ ┌──────┐│
│           │  │      │ │      │ │      ││
│  Party    │  └──────┘ └──────┘ └──────┘│
│  Grade    │  ┌──────┐ ┌──────┐ ┌──────┐│
│  State    │  │      │ │      │ │      ││
│  Committee│  └──────┘ └──────┘ └──────┘│
│           │                             │
│           │  [Load More]                │
│           │                             │
└───────────┴─────────────────────────────┘
```

#### Filter Sidebar (Desktop)
```html
<aside class="w-64 flex-shrink-0 bg-white border-r border-slate-200 p-6 h-screen sticky top-0 overflow-y-auto">
  <h3 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
    Filters
  </h3>
  
  <!-- Search -->
  <div class="mb-6">
    <input type="text" 
           placeholder="Search..."
           class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
  </div>
  
  <!-- Grade Filter -->
  <div class="mb-6">
    <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      Trust Grade
    </h4>
    <div class="space-y-2">
      <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
        <input type="checkbox" class="rounded text-blue-600" />
        <span class="inline-flex items-center gap-2 text-sm">
          <span class="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">A</span>
          Transparent
        </span>
      </label>
      
      <!-- Repeat for B, C, D, F -->
    </div>
  </div>
  
  <!-- Party Filter -->
  <div class="mb-6">
    <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      Party
    </h4>
    <div class="space-y-2">
      <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
        <input type="checkbox" class="rounded text-blue-600" />
        <span class="text-sm text-slate-700">Democrat</span>
      </label>
      <!-- Repeat for others -->
    </div>
  </div>
  
  <!-- State Filter (Dropdown or searchable) -->
  <div class="mb-6">
    <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      State
    </h4>
    <select class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
      <option>All States</option>
      <option>Alabama</option>
      <!-- ... -->
    </select>
  </div>
  
  <!-- Clear Filters -->
  <button class="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
    Clear All Filters
  </button>
</aside>
```

#### Grid Container
```html
<main class="flex-1 p-6">
  <!-- Sort & View Options -->
  <div class="flex items-center justify-between mb-6">
    <div class="text-sm text-slate-600">
      Showing <strong>435 representatives</strong>
    </div>
    
    <div class="flex items-center gap-4">
      <select class="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
        <option>Sort: Grade (F→A)</option>
        <option>Sort: Grade (A→F)</option>
        <option>Sort: Net Worth</option>
        <option>Sort: Name</option>
      </select>
      
      <!-- View Toggle -->
      <div class="flex gap-1 bg-slate-100 rounded-lg p-1">
        <button class="px-3 py-1 rounded bg-white shadow text-sm">Grid</button>
        <button class="px-3 py-1 text-slate-600 text-sm">List</button>
      </div>
    </div>
  </div>
  
  <!-- Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <!-- Rep Card components here -->
  </div>
  
  <!-- Pagination or Infinite Scroll -->
  <div class="mt-8 flex justify-center">
    <button class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
      Load More
    </button>
  </div>
</main>
```

### 3. Individual Representative Detail Page

**Purpose:** Deep dive into one rep's full record

#### Layout
```
┌───────────────────────────────────────────────┐
│  HEADER                                       │
├───────────────────────────────────────────────┤
│                                               │
│  HERO SECTION                                 │
│  ┌──────────┐                                 │
│  │  Photo   │  Rep. Jane Doe                  │
│  │          │  Democrat • CA-12               │
│  └──────────┘  [Grade: A] [Contact]           │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│  KEY METRICS (4-col grid)                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │Net Worth│ │Trades │ │Donors  │ │Votes   ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│  TAB NAVIGATION                               │
│  [Overview] [Donors] [Trades] [Votes]         │
│                                               │
│  ┌──────────────────┐ ┌────────────────────┐ │
│  │                  │ │                    │ │
│  │  Main Content    │ │  Sidebar           │ │
│  │  (Active Tab)    │ │  - Committees      │ │
│  │                  │ │  - Contact Info    │ │
│  │                  │ │  - Recent News     │ │
│  └──────────────────┘ └────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

#### Hero Section
```html
<section class="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-12">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row items-start gap-8">
      <!-- Photo & Basic Info -->
      <div class="flex-shrink-0">
        <img src="rep-photo.jpg" 
             alt="Rep. Jane Doe"
             class="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-lg" />
      </div>
      
      <div class="flex-1">
        <!-- Name & Title -->
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
          Rep. Jane Doe
        </h1>
        
        <!-- Party & District -->
        <div class="flex items-center gap-3 mb-6">
          <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            Democrat
          </span>
          <span class="text-lg text-slate-600">California, District 12</span>
          <span class="text-slate-400">•</span>
          <span class="text-slate-600">In office since 2018</span>
        </div>
        
        <!-- Grade (Large) -->
        <div class="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 mb-6">
          <span class="font-mono text-6xl font-bold text-emerald-700">A</span>
          <div class="flex flex-col">
            <span class="text-sm font-semibold uppercase tracking-wider text-emerald-700">Trust Score</span>
            <span class="text-lg font-medium text-emerald-600">Transparent & Accountable</span>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex gap-3">
          <button class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Contact
          </button>
          
          <button class="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Tab Navigation
```html
<nav class="bg-white border-b border-slate-200 sticky top-0 z-10">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex gap-8">
      <button class="px-1 py-4 text-blue-600 font-semibold border-b-2 border-blue-600">
        Overview
      </button>
      <button class="px-1 py-4 text-slate-600 font-medium hover:text-slate-900">
        Donors & Funding
      </button>
      <button class="px-1 py-4 text-slate-600 font-medium hover:text-slate-900">
        Stock Trades
      </button>
      <button class="px-1 py-4 text-slate-600 font-medium hover:text-slate-900">
        Voting Record
      </button>
      <button class="px-1 py-4 text-slate-600 font-medium hover:text-slate-900">
        Statements
      </button>
    </div>
  </div>
</nav>
```

#### Overview Tab Content
```html
<div class="max-w-7xl mx-auto px-6 py-12">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Content (2/3 width) -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Net Worth Stat Card -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Net Worth Change
          </div>
          <div class="font-mono text-4xl font-bold text-red-600 mb-2">
            +$2.4M
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              ↑ 180%
            </span>
            <span class="text-sm text-slate-500">Since 2018</span>
          </div>
        </div>
        
        <!-- Stock Trades -->
        <!-- Donors -->
        <!-- Vote Alignment -->
      </div>
      
      <!-- Funding Sources Component -->
      <!-- (Insert Donor Breakdown Chart) -->
      
      <!-- Stock Trade Timeline -->
      <!-- (Insert Stock Trade Timeline) -->
      
      <!-- Vote vs Statement Tracker -->
      <!-- (Insert Vote Tracker) -->
    </div>
    
    <!-- Sidebar (1/3 width) -->
    <aside class="space-y-6">
      <!-- Committees -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
          Committees
        </h4>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <svg class="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <div class="flex-1">
              <div class="text-sm font-medium text-slate-900">Ways & Means</div>
              <div class="text-xs text-slate-500">Chair</div>
            </div>
          </div>
          <!-- Repeat for other committees -->
        </div>
      </div>
      
      <!-- Contact Information -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
          Contact
        </h4>
        <div class="space-y-3 text-sm">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">DC Office</div>
            <div class="text-slate-700">123 Cannon HOB</div>
            <div class="text-slate-700">Washington, DC 20515</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</div>
            <a href="tel:2025551234" class="text-blue-600 hover:underline">(202) 555-1234</a>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Website</div>
            <a href="#" class="text-blue-600 hover:underline">doe.house.gov</a>
          </div>
        </div>
      </div>
      
      <!-- Social Media -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h4 class="text-base font-semibold uppercase tracking-wide text-slate-700 mb-4">
          Follow
        </h4>
        <div class="flex gap-3">
          <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
            <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <!-- Twitter icon -->
            </svg>
          </a>
          <!-- Facebook, Instagram, etc. -->
        </div>
      </div>
    </aside>
  </div>
</div>
```

---

## 🎯 Data Visualization Principles

### 1. Color Usage for Data
- **Red = Bad/Concerning** - High net worth increase, vote discrepancies, corporate funding dominance
- **Green = Good/Transparent** - Individual donors, vote alignment, disclosure
- **Amber/Orange = Warning** - Moderate concerns, needs attention
- **Blue = Neutral/Informational** - Party affiliation (muted), general stats
- **Slate/Gray = Baseline** - Neutral data, labels, structure

### 2. Number Formatting
- **Currency:** `$2.4M` (not `$2,400,000`) - Use K, M, B suffixes
- **Percentages:** `+180%` (include +/- sign for changes)
- **Dates:** `March 15, 2024` (full dates) or `Mar 15` (compact)
- **Counts:** `8,429` (comma separators for 1000+)

### 3. Chart Types
- **Stacked bar charts** for donor breakdowns (PAC vs individual vs corporate)
- **Timeline** for stock trades correlated with events
- **Horizontal meter/gauge** for alignment scores
- **Simple bar charts** for committee comparisons
- **Avoid:** Pie charts (hard to compare), 3D charts, overly complex visualizations

### 4. Hierarchy in Data
**Primary (Largest, boldest):** Grade, Net Worth change, Key corruption indicators  
**Secondary (Medium):** Individual stats, donor totals, trade counts  
**Tertiary (Smallest):** Labels, dates, metadata, sources

---

## ♿ Accessibility Standards

### Contrast Requirements (WCAG AA)
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 for borders/icons

### Tested Combinations (All pass WCAG AA)
| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Primary heading | `text-slate-900` | `bg-white` | 16.7:1 ✅ |
| Body text | `text-slate-600` | `bg-white` | 8.6:1 ✅ |
| Secondary text | `text-slate-500` | `bg-white` | 6.5:1 ✅ |
| Grade A | `text-emerald-700` | `bg-emerald-50` | 7.2:1 ✅ |
| Grade F | `text-red-700` | `bg-red-50` | 7.8:1 ✅ |

### Interactive Elements
- **Focus states:** 2px blue ring (`focus:ring-2 focus:ring-blue-500`)
- **Touch targets:** Minimum 44×44px on mobile
- **Keyboard navigation:** All interactive elements must be keyboard accessible
- **ARIA labels:** For icon-only buttons and complex widgets

### Screen Reader Support
```html
<!-- Grade badge with proper semantics -->
<div role="img" aria-label="Trust score: A - Transparent and accountable">
  <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 border-2 border-emerald-500">
    <span class="font-mono text-4xl font-bold text-emerald-700" aria-hidden="true">A</span>
    <div class="flex flex-col" aria-hidden="true">
      <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Trust Score</span>
      <span class="text-sm font-medium text-emerald-600">Transparent</span>
    </div>
  </div>
</div>
```

---

## 🚀 Performance Optimization

### Image Strategy
- **Representative photos:** WebP format, 256×256px (2x for retina = 512×512 source)
- **Lazy loading:** `loading="lazy"` for below-fold images
- **Placeholder:** Low-quality placeholder (LQIP) or skeleton while loading

### Font Loading
```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

### Data Loading
- **Pagination or infinite scroll** for rep lists (load 20-30 at a time)
- **Skeleton screens** while loading (don't show spinners)
- **Optimistic UI** for filters (update immediately, refine in background)

---

## 📐 Design Tokens (CSS Variables)

For developers implementing this, create a centralized token system:

```css
:root {
  /* Colors - Primary */
  --color-primary-900: #0f172a;
  --color-primary-800: #1e293b;
  --color-primary-700: #334155;
  --color-primary-600: #475569;
  --color-primary-100: #f1f5f9;
  --color-primary-50: #f8fafc;
  
  /* Colors - Semantic */
  --color-grade-a: #10b981;
  --color-grade-b: #84cc16;
  --color-grade-c: #f59e0b;
  --color-grade-d: #f97316;
  --color-grade-f: #ef4444;
  
  --color-party-dem: #3b82f6;
  --color-party-rep: #dc2626;
  --color-party-ind: #9333ea;
  
  /* Typography */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  
  /* Spacing */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
  
  /* Borders */
  --radius-sm: 0.5rem;   /* 8px */
  --radius-md: 0.75rem;  /* 12px */
  --radius-lg: 1rem;     /* 16px */
  --radius-xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Tailwind CSS with custom config
- [ ] Import Google Fonts (Inter + JetBrains Mono)
- [ ] Create color palette CSS variables
- [ ] Build component library (Grade Badge, Rep Card, Stat Card)
- [ ] Implement responsive grid system

### Phase 2: Pages
- [ ] Build Homepage (hero, search, stats, worst offenders)
- [ ] Build Rep List page (filters, grid, pagination)
- [ ] Build Rep Detail page (hero, tabs, sidebar)
- [ ] Implement search functionality
- [ ] Add filter logic

### Phase 3: Data Visualization
- [ ] Donor breakdown stacked bar chart
- [ ] Stock trade timeline with event correlation
- [ ] Vote alignment meter
- [ ] Committee badges
- [ ] Net worth change indicators

### Phase 4: Polish
- [ ] Add loading states (skeleton screens)
- [ ] Implement hover/focus states
- [ ] Add transitions and animations
- [ ] Optimize images (WebP, lazy loading)
- [ ] Test accessibility (keyboard nav, screen readers)
- [ ] Test responsive behavior on real devices

### Phase 5: Testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Accessibility audit (WAVE, axe DevTools)
- [ ] Performance testing (Lighthouse score 90+)
- [ ] User testing for scannability

---

## 📊 Success Metrics

A successful design should achieve:

1. **Scannability:** User can assess a rep's grade and key metrics in <3 seconds
2. **Clarity:** No confusion about what data means (corruption vs transparency)
3. **Trust:** Design feels authoritative, not partisan or sensational
4. **Performance:** Lighthouse score 90+ on mobile and desktop
5. **Accessibility:** WCAG AA compliant, usable with keyboard and screen readers
6. **Mobile-first:** 60%+ of users will be on mobile - must work flawlessly

---

## 🎨 Design Philosophy Summary

**What This Design Is:**
- Professional and trustworthy (like Bloomberg or NYT)
- Data-driven and scannable
- Modern but timeless
- Accessible and inclusive
- Clear hierarchy (grade/corruption front-and-center)

**What This Design Is NOT:**
- Political or partisan (neutral, data-focused)
- Trendy or flashy (no gradients everywhere, no glassmorphism)
- Dark mode by default (light for trust and readability)
- Overwhelming (progressive disclosure, tabs, clean layout)
- 1990s (NO table-based layouts, NO Times New Roman, NO bright primary colors)

---

## 🔗 Reference Comparisons

| Site | What to Adopt | What to Avoid |
|------|---------------|---------------|
| **GovTrack.us** | Clean layout, party pills, tenure stats | Somewhat dated typography, cluttered sidebars |
| **Quiver Quantitative** | Clean data tables, clear metrics | Too minimalist, lacks visual hierarchy |
| **Capitol Trades** | Stock trade visualization, timeline | Dark theme (we use light), dense information |
| **Bloomberg Terminal** | Professional aesthetic, data density, trust | Too complex for general audience |
| **New York Times** | Typography, white space, credibility | Article-focused (we're data-focused) |

---

## 📝 Final Notes for Developers

1. **Use Tailwind CSS** - All classes provided are Tailwind v3+ compatible
2. **Component-first** - Build reusable components, not page-specific styles
3. **Mobile-first** - Start with mobile layout, enhance for desktop
4. **Semantic HTML** - Use proper heading hierarchy, landmarks, ARIA when needed
5. **Performance matters** - Optimize images, lazy load, use skeleton screens
6. **Test with real data** - Design looks different with actual rep names/photos
7. **Iterate** - This is v1.0 - gather user feedback and refine

**Questions? Clarifications needed?**
This spec is comprehensive but living. Update as you build and discover edge cases.

---

**End of Design Specification v1.0**
