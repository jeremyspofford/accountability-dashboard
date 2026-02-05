# Design Implementation Quick Reference

## 🎯 Top Priorities (Build First)

### 1. Grade Badge System
**Why it's critical:** This is the primary trust indicator - must be instantly scannable.

**5 variants needed:**
- Grade A (Emerald): Transparent
- Grade B (Lime): Trustworthy
- Grade C (Amber): Concerning
- Grade D (Orange): Questionable
- Grade F (Red): Corrupt

**Implementation:** See Component #1 in design-spec.md

---

### 2. Representative Card
**Why it's critical:** This is the main browsing interface. Users will scan dozens of these.

**Must include:**
- Photo (16×16 on mobile, 64×64 desktop)
- Name + Party + District
- Grade badge (prominent)
- 3 key metrics: Net Worth, Trades, Donors
- Hover state with shadow lift

**Implementation:** See Component #2 in design-spec.md

---

### 3. Color System (Do NOT skip this)
**Why it's critical:** Consistency across all components depends on this foundation.

```css
/* Copy this into your Tailwind config or CSS variables */
--grade-a:  #10b981    /* Green = Good */
--grade-b:  #84cc16
--grade-c:  #f59e0b    /* Amber = Warning */
--grade-d:  #f97316
--grade-f:  #ef4444    /* Red = Bad */

--party-dem:  #3b82f6  /* Muted blue */
--party-rep:  #dc2626  /* Muted red */
--party-ind:  #9333ea  /* Purple */
```

**Rule:** Red = corruption/bad, Green = transparency/good, Party colors = subtle accents only

---

### 4. Typography Setup
**Why it's critical:** Readability is everything for a data-heavy site.

**Import these fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

**Usage:**
- **Inter** for ALL UI text (body, headings, labels)
- **JetBrains Mono** for numbers ONLY (grades, currency, stats)

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This:
1. **Making it dark by default** - Light theme builds trust for political data
2. **Using party colors as primary** - This must feel non-partisan
3. **Showing every metric at once** - Use tabs and progressive disclosure
4. **Tiny touch targets on mobile** - Minimum 44×44px
5. **Using pie charts** - Stacked bars are more scannable
6. **Forgetting hover states** - Cards need that subtle lift on hover
7. **Skipping accessibility** - Focus rings, ARIA labels, contrast ratios matter

### ✅ Do This Instead:
1. Light backgrounds, high contrast text
2. Party as small pills/badges only
3. Tabs for different data sections
4. Generous padding on mobile buttons
5. Horizontal stacked bars for donor breakdown
6. `hover:shadow-lg transition-shadow` on cards
7. Test with keyboard and screen reader

---

## 📱 Mobile-First Checklist

Since 60%+ users will be on mobile:

- [ ] Rep cards stack vertically (no grid on mobile)
- [ ] Photos are 48×48px (not 64×64)
- [ ] Show only 2 key metrics (hide 3rd on small screens)
- [ ] Filters in bottom sheet or drawer (not sidebar)
- [ ] Grade badges scale down (text-2xl instead of text-4xl)
- [ ] Search bar full width with large tap target
- [ ] Bottom navigation for key sections
- [ ] Collapsible sections (accordions) for dense data

---

## 🎨 Design Decisions Explained

### Why Light Theme?
**Problem:** Current site is too dark, hard to read  
**Solution:** White/light slate backgrounds feel trustworthy and professional  
**Reference:** Bloomberg, NYT, GovTrack all use light themes for credibility

### Why A-F Grading?
**Problem:** Complex metrics are hard to understand  
**Solution:** Everyone understands school grades - instant comprehension  
**Visual:** Large, bold letter in a colored badge (impossible to miss)

### Why Monospace for Numbers?
**Problem:** Proportional fonts make number columns look messy  
**Solution:** JetBrains Mono aligns digits, looks professional (not "techy")  
**Bonus:** Creates visual distinction between labels and data

### Why Stacked Bars Instead of Pie Charts?
**Problem:** Pie charts are hard to compare (is 32% bigger than 28%?)  
**Solution:** Horizontal bars with percentages are instantly scannable  
**Bonus:** Works better on mobile (vertical pie charts waste space)

### Why Slate Instead of Pure Gray?
**Problem:** Pure grays (#888, etc.) look dated and harsh  
**Solution:** Slate has slight blue undertone - feels modern and softer  
**Tailwind:** `text-slate-600` is more refined than `text-gray-600`

---

## 🔧 Tailwind Config Additions

Add these to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // Grade colors
        'grade-a': '#10b981',
        'grade-b': '#84cc16',
        'grade-c': '#f59e0b',
        'grade-d': '#f97316',
        'grade-f': '#ef4444',
      },
      maxWidth: {
        '8xl': '1440px', // For wider data tables
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For better form styling
  ],
}
```

---

## 📊 Data Visualization Quick Rules

### Net Worth Changes
- **Display:** `+$2.4M` with percentage `+180%`
- **Color:** Red if increased >50%, Amber if 10-50%, Green if decreased or <10%
- **Context:** "Since taking office (2018)"

### Stock Trades
- **Display:** Count (47), timeline view with dates
- **Color:** Red dot for concerning trades (near votes/meetings)
- **Context:** "Last 12 months" or specific date range

### Donor Breakdown
- **Display:** Stacked bar (Corporate | Industry | Individual)
- **Color:** Red for corporate, Amber for industry, Green for individual
- **Show:** Percentages + dollar amounts in legend

### Vote Alignment
- **Display:** Percentage (67%) + horizontal meter
- **Color:** Red <50%, Amber 50-75%, Green >75%
- **Context:** "Statements vs actual votes"

---

## 🎯 Testing Priorities

### Before Launch:
1. **Mobile Safari** - Biggest user base, test on real iPhone
2. **Keyboard navigation** - Tab through entire page, no traps
3. **Screen reader** - Run VoiceOver/NVDA on rep card and detail page
4. **Slow 3G** - Test loading states, skeletons, lazy loading
5. **Color blindness** - Use simulator to check grade colors
6. **Touch targets** - All buttons/links at least 44×44px on mobile

### Success Criteria:
- Lighthouse score: 90+ (mobile and desktop)
- WCAG AA compliant (contrast, keyboard, ARIA)
- Grade visible and comprehensible in <3 seconds
- Works on iPhone 8 and Galaxy S9 (older devices)

---

## 📄 Build Order (Suggested)

### Week 1: Foundation
1. Set up Tailwind with fonts and colors
2. Build Grade Badge component (all 5 variants)
3. Build Stat Card component
4. Build Rep Card component
5. Test responsive behavior

### Week 2: Pages
1. Build Homepage (hero + search)
2. Build Rep List page (grid + filters)
3. Build Rep Detail page (hero + tabs)
4. Add dummy data for testing

### Week 3: Data Components
1. Donor breakdown chart
2. Stock trade timeline
3. Vote alignment tracker
4. Committee badges
5. Hook up real data

### Week 4: Polish & Test
1. Loading states (skeletons)
2. Hover/focus states
3. Accessibility testing
4. Performance optimization
5. Cross-browser testing
6. User testing

---

## 🎨 Component Priority Matrix

| Component | Priority | Reason |
|-----------|----------|--------|
| Grade Badge | 🔴 Critical | Primary trust indicator |
| Rep Card | 🔴 Critical | Main browsing interface |
| Search Bar | 🔴 Critical | Primary navigation method |
| Stat Card | 🟡 High | Core data display |
| Donor Chart | 🟡 High | Key accountability metric |
| Trade Timeline | 🟡 High | Corruption indicator |
| Vote Tracker | 🟡 High | Trust/lies metric |
| Committee Badge | 🟢 Medium | Informational |
| Social Links | 🟢 Medium | Nice to have |
| Share Button | ⚪ Low | Can add later |

---

## 💡 Pro Tips for Developers

### 1. Use Semantic HTML
```html
<!-- Good -->
<article class="rep-card">
  <header>
    <h3>Rep. Jane Doe</h3>
  </header>
  <section aria-label="Key metrics">
    ...
  </section>
</article>

<!-- Bad -->
<div class="rep-card">
  <div>
    <div>Rep. Jane Doe</div>
  </div>
</div>
```

### 2. Skeleton Screens > Spinners
```html
<!-- While loading -->
<div class="animate-pulse">
  <div class="h-16 w-16 bg-slate-200 rounded-full"></div>
  <div class="h-4 bg-slate-200 rounded w-3/4"></div>
  <div class="h-4 bg-slate-200 rounded w-1/2"></div>
</div>
```

### 3. Accessible Grade Badges
```html
<div role="img" aria-label="Trust score: A - Transparent">
  <span aria-hidden="true">A</span>
</div>
```

### 4. Responsive Images
```html
<img 
  srcset="rep-photo-128.webp 1x, rep-photo-256.webp 2x"
  src="rep-photo-128.webp"
  alt="Representative Jane Doe"
  loading="lazy"
  width="64"
  height="64"
/>
```

### 5. Focus Management
```jsx
// When filter changes, announce to screen readers
const [filterCount, setFilterCount] = useState(0);

<div role="status" aria-live="polite" class="sr-only">
  Showing {filterCount} representatives
</div>
```

---

## ❓ FAQ

**Q: Should we support dark mode?**  
A: Not initially. Light theme = trust for political data. Can add as optional toggle later.

**Q: What if we don't have data for all metrics?**  
A: Show "Data unavailable" with explanation. Don't hide the section - transparency matters.

**Q: How do we handle ties in grades (e.g., multiple A-rated reps)?**  
A: Secondary sort by name alphabetically. Show count: "127 representatives with grade A"

**Q: Mobile-first or desktop-first?**  
A: Mobile-first. Most users will be on phones. Desktop is an enhancement.

**Q: Can we change the color palette?**  
A: Colors are semantic (red=bad, green=good). Changing them would confuse users. Exact shades can be tweaked slightly.

**Q: What about print styles?**  
A: Not a priority for v1. Most users will share links, not print pages.

---

## 🔗 Resources

**Design References:**
- Tailwind CSS docs: https://tailwindcss.com/docs
- WCAG guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Color contrast checker: https://webaim.org/resources/contrastchecker/

**Fonts:**
- Inter: https://fonts.google.com/specimen/Inter
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono

**Inspiration:**
- GovTrack.us (layout)
- Quiver Quantitative (data tables)
- Capitol Trades (stock visualization)
- Bloomberg (professional aesthetic)
- The New York Times (typography, trust)

---

**End of Implementation Guide**

Use `design-spec.md` for detailed specifications.  
Use this guide for quick reference and priorities.
