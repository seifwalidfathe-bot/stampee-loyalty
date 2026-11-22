# Stampee Design System Specification (DESIGN.md)

Adopted from **`awesome-design-md`** catalog (`linear.app` + `notion` tactile paper craft).

## 1. System Vision & Philosophy
- **Merchant Admin & Cashier Terminal**: Modeled on `Linear` (Precision dark craft, high density, hairline `#22272B` borders, zero neon glow slop, monospace data telemetry).
- **Customer Mobile Pass**: Modeled on `Notion` & tactile specialty coffee craft paper (warm cream `#FAF7EE` paper, debossed stamp slots, authentic rubber-stamp ink texture with physical rotation variance, Web Audio API mechanical thump sound).

---

## 2. Token Architecture

### Color Palette

#### Dark Canvas (Linear Craft for Admin & POS)
- `canvas`: `#08090A` (Deep dark background)
- `surface-1`: `#121517` (Card panels & terminal elevation)
- `surface-2`: `#181B1E` (Active elements & inputs)
- `hairline`: `#22272B` (Subtle 1px borders)
- `hairline-subtle`: `rgba(255, 255, 255, 0.08)`
- `accent-primary`: `#E11D48` (Rose-600 / primary stamp seal)
- `accent-emerald`: `#10B981` (Redeem reward / active telemetry)
- `accent-amber`: `#F59E0B` (Reward milestone highlight)

#### Tactile Paper Canvas (Customer Pass)
- `paper-base`: `#FAF7EE` (Warm tactile cream)
- `paper-texture`: `radial-gradient(#E8DFC8 0.75px, transparent 0.75px)`
- `paper-border`: `#DDD3BC` (Warm debossed border)
- `ink-stamp`: `#C23A22` (Authentic vermilion rubber stamp ink)
- `ink-text`: `#2C2723` (Warm charcoal typography)

---

## 3. Typography Hierarchy
- **Primary Interface**: `Plus Jakarta Sans`, `Inter`, sans-serif
- **Data & Telemetry**: `JetBrains Mono`, `Fira Code`, monospace
- **Stamp Numbering**: `Courier New`, monospace (vintage stamp serial feel)

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-lg` | 24px-28px | 800 | 1.15 | Brand titles & Counter stand headlines |
| `title-md` | 16px-18px | 700 | 1.25 | Card headers & Terminal mode titles |
| `body-sm` | 13px-14px | 500 | 1.4 | Descriptions & labels |
| `telemetry-xs` | 11px-12px | 600 (mono) | 1.0 | Customer phones, PINs, card IDs |
| `stamp-label` | 9px-10px | 700 (mono) | 1.0 | Slot numbering (#1..#8) |

---

## 4. Micro-Interactions & Physics
- **Rubber Stamp Press**: Scale `2.4 -> 0.92 -> 1.0` with `var(--stamp-rot)` dynamic rotation between -9° and +8° to simulate human hand stamping.
- **Physical Sound Synthesis**: Web Audio API oscillator (`140Hz -> 32Hz` triangle drop + bandpass white noise click at `850Hz`) mimicking an ink rubber stamp on paper.
- **Haptic Feedback**: `navigator.vibrate([35, 20, 60])` for physical resistance.
- **Reward Celebration**: Canvas confetti burst + 4-note ascending chime sequence on full card completion.

---

## 5. Responsive Finish & Touch Gate
- All touch targets $\ge 44\text{px}$ (`h-11`, `h-12`, `h-14` action buttons).
- Zero horizontal overflow (`overflow-x-hidden`, safe margins).
- PWA / Apple Wallet pass presentation standards with 3-second counter checkout flow.
