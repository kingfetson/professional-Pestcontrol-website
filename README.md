#  BioGuard Pest Control Nairobi — Website

> A tactical, nature-science aesthetic landing page for a licensed pest control company in Nairobi, Kenya — with live Google Sheets lead capture, urgency detection, and emergency email routing built in.

---

## ✨ Design Philosophy

| Attribute | Choice |
|---|---|
| **Aesthetic** | Tactical / Science-Nature Hybrid — authoritative, trustworthy, field-grade |
| **Display Font** | [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) — commanding all-caps military/field presence |
| **Body Font** | [Nunito](https://fonts.google.com/specimen/Nunito) — friendly, rounded, approachable |
| **Palette** | Forest Green `#1a3a2a` · Tactical Olive `#3d5a3e` · Warm Amber `#d4860a` · Off-White `#f5f2eb` |
| **Mood** | Field manual meets professional services — serious without being cold |
| **Unforgettable detail** | Red pulsing emergency card + urgency-aware submit button that turns red on "EMERGENCY" selection |

---

## 📁 Project Structure

```
bioguard-pest-control-nairobi/
│
├── index.html    # Full page HTML — 7 sections, semantic markup
├── style.css     # All styles — CSS variables, forest green theme, responsive
├── script.js     # JavaScript — nav, form, Sheets, counters, urgency UX
└── Code.gs       # Google Apps Script — lead capture with emergency routing
```

> **Zero build tools. Zero dependencies.** Open `index.html` and it works.

---

## 🗂️ Page Sections

| Section | Description |
|---|---|
| **Hero** | Dark forest background with hex-grid texture, three-line headline, trust strip, red emergency floating card |
| **Pests We Treat** | 8-card grid with emoji pest icons, threat-level badges (CRITICAL / HIGH / MEDIUM), featured dark card |
| **Services** | 6-card grid on forest-deep background, amber top-bar hover reveal, ghost number decorations |
| **Why Us** | Two-column with animated stat counters and icon-list feature section |
| **Testimonials** | 3-column with verified badges and featured green card |
| **Booking / Quote Form** | Split layout — emergency call box, service areas, 8-field quote form |
| **Footer** | Brand + NEMA badge, two services lists, emergency contacts |

---

## 🚀 Quick Start

### 1. Get the files

```bash
git clone https://github.com/yourname/bioguard-pest-control.git
cd bioguard-pest-control
```

### 2. Open locally

```bash
open index.html
# or use VS Code Live Server
```

### 3. Replace your details

| Find | Replace with | File(s) |
|---|---|---|
| `BioGuard` | Your business name | `index.html`, `Code.gs` |
| `+254700000000` | Your real number | `index.html` |
| `info@bioguard.co.ke` | Your real email | `index.html` |
| `Parklands, Nairobi` | Your actual office | `index.html` |
| `NEMA Reg. No: XXXXXXX` | Your actual NEMA reg number | `index.html` footer |
| `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` | Your deployed Apps Script URL | `script.js` |

---

## 📊 Google Sheets Lead Integration

Every quote request lands in a Google Sheet with automatic row colour coding and emergency routing.

### Data Flow

```
Client submits form  →  script.js detects urgency  →  POSTs payload  →  Code.gs
                                                                            ↓
                                               Row appended (red for emergency, green for normal)
                                                                            ↓
                                                   Email sent to NOTIFY_EMAIL
                                               + if emergency: EMERGENCY_EMAIL too
```

### Setup (~5 minutes)

**Step 1 — Create your Google Sheet**

[sheets.google.com](https://sheets.google.com) → New → name it `BioGuard – Quote Requests`

**Step 2 — Open Apps Script**

Inside the sheet: **Extensions → Apps Script**

**Step 3 — Paste Code.gs**

Delete all code. Paste the full contents of `Code.gs`.

Configure notification emails:
```javascript
var NOTIFY_EMAIL    = 'you@yourcompany.co.ke';       // standard alerts
var EMERGENCY_EMAIL = 'manager@yourcompany.co.ke';   // gets emergency alerts too
```

**Step 4 — Deploy**

```
Deploy → New Deployment
  Type           → Web App
  Execute as     → Me
  Who has access → Anyone
```
Copy the Web App URL.

**Step 5 — Connect**

In `script.js` line 14:
```javascript
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

**Step 6 — Test**

Submit a quote request. Select "EMERGENCY" urgency and watch the button turn red and the sheet row highlight in red.

---

### Sheet Column Structure

| Column | Content | Notes |
|---|---|---|
| **Timestamp** | Date & time (Nairobi EAT) | Auto-filled |
| **Full Name** | Client name | From form |
| **Phone** | Phone number | From form |
| **Email** | Email address | From form (optional) |
| **Pest Type** | Selected pest | From dropdown |
| **Property Type** | House / Office / etc | From dropdown |
| **Location** | Estate / area | From form |
| **Urgency** | Urgency label | From dropdown |
| **Notes** | Special details | From form |
| **Status** | `New` or `EMERGENCY` | Auto-set, update manually |
| **Assigned Technician** | Technician name | Fill manually |
| **Quote Sent** | Y/N | Fill manually |
| **Treatment Date** | Scheduled date | Fill manually |
| **Device** | Mobile / Desktop | Auto-detected |
| **Page URL** | Referral page | Auto-filled |

> 🚨 **Emergency rows** are highlighted red automatically — Pest column bolded for instant scanning.
>
> ✅ **Normal rows** are highlighted in a light green tint.

---

## 🎨 Design System

### Colour Palette

```css
--forest:       #1a3a2a   /* Hero, dark sections, logo background */
--forest-deep:  #0f2219   /* Darkest — hero bg, footer, services section */
--forest-mid:   #1e4430   /* Service cards */
--olive:        #3d5a3e   /* Feature icons, form focus rings */
--olive-lt:     #4e7050   /* Lighter accent, verified badges */
--amber:        #d4860a   /* Primary accent — CTAs, icons, hover states */
--amber-lt:     #f0a830   /* Lighter amber on dark backgrounds */
--danger:       #c0392b   /* Emergency elements, error states */
--warning:      #e67e22   /* High-risk pest badges */
--cream:        #f5f2eb   /* Page background */
--cream-dark:   #ede8de   /* Why Us section background */
```

### Threat Level Badge System

The pest grid uses three threat levels with distinct colour coding:

```html
<!-- Applied to .pest-threat elements -->
<div class="pest-threat critical">CRITICAL</div>   <!-- Red — Termites, Bedbugs -->
<div class="pest-threat high">HIGH RISK</div>       <!-- Orange — Cockroaches, Rodents, Snakes -->
<div class="pest-threat medium">MEDIUM RISK</div>   <!-- Amber — Mosquitoes, Bees, Fleas -->
```

### Key Animations

| Animation | Element | Behaviour |
|---|---|---|
| `heroSlide` | Hero content + urgency card | Fade + slide up on load |
| `alertPulse` | Hero alert icon | Rapid blinking red |
| `urgPulse` | Urgency card dot | Green pulsing ring |
| `emPulse` | Emergency call icon | Danger-red pulse ring |
| `hexOverlay` | Hero background | Geometric grid texture |
| Top bar reveal | Service cards `::after` | Grows left-to-right on hover |
| Stat counters | Why Us numbers | Count up on scroll into view |
| Scroll reveal | Pest cards, features | Fade + slide on IntersectionObserver |
| Urgency highlight | Submit button | Turns red when "EMERGENCY" selected |

---

## ⚙️ JavaScript Features

| Feature | Description |
|---|---|
| Sticky header | Transparent → solid with shadow after 60px |
| Mobile nav | Slide-in drawer, overlay, Escape key |
| Smooth scroll | Header-height-offset anchor scrolling |
| Quote form | 8-field validation, urgency-aware messaging |
| Google Sheets | Full payload POST with emergency detection |
| **Urgency highlight** | Button turns red + changes text on EMERGENCY selection |
| **Dual email routing** | Emergencies trigger `EMERGENCY_EMAIL` separately |
| Stat counters | `IntersectionObserver` count-up animation |
| Scroll reveal | Staggered fade-in per element |
| Footer year | Auto-updated copyright year |

---

## 🌍 Deployment

### Free Static Hosting

| Platform | Free | Notes |
|---|---|---|
| [Netlify](https://netlify.com) | ✅ | Drag & drop the 3 files |
| [Vercel](https://vercel.com) | ✅ | Connect GitHub repo |
| [GitHub Pages](https://pages.github.com) | ✅ | Push to `gh-pages` |
| [Cloudflare Pages](https://pages.cloudflare.com) | ✅ | Fastest CDN globally |

> ⚠️ `Code.gs` is deployed separately in Google Apps Script — not in your hosting folder.

---

## 🔧 Customisation Guide

### Add a Pest Card

```html
<div class="pest-card">
  <div class="pest-icon">
    <img src="EMOJI_OR_ICON_URL" alt="Pest Name" loading="lazy">
  </div>
  <h3>Pest Name</h3>
  <p>Short description of treatment approach.</p>
  <div class="pest-threat critical">CRITICAL</div>
  <!-- Options: class="pest-threat critical|high|medium" -->
</div>
```

### Add a Service

```html
<article class="svc-card">
  <div class="svc-num">07</div>
  <div class="svc-icon-wrap"><i class="fas fa-YOUR-ICON"></i></div>
  <h3>SERVICE NAME</h3>
  <p>Description of the service.</p>
  <ul class="svc-list">
    <li>Feature one</li>
    <li>Feature two</li>
  </ul>
  <a href="#contact" class="svc-link">Request Quote <i class="fas fa-arrow-right"></i></a>
</article>
```

### Add a Service Area Tag

```html
<span class="tag">Your Area</span>
```

### Customise Urgency Options

In `index.html`, the urgency dropdown:
```html
<select id="urgency">
  <option value="flexible">Flexible — anytime this week</option>
  <option value="soon">Soon — within 2–3 days</option>
  <option value="urgent">Urgent — today or tomorrow</option>
  <option value="emergency">EMERGENCY — same day needed</option>
</select>
```

The `value="emergency"` triggers the red button highlight and emergency email routing. Don't change this value without updating `script.js` and `Code.gs` accordingly.

---

## ✅ Pre-Launch Checklist

- [ ] Replace all `+254700000000` with real phone number
- [ ] Replace email placeholders with real addresses
- [ ] Add your actual NEMA registration number in footer
- [ ] Update office location from "Parklands"
- [ ] Deploy `Code.gs` and paste URL into `script.js`
- [ ] Set `NOTIFY_EMAIL` in `Code.gs` for standard alerts
- [ ] Set `EMERGENCY_EMAIL` in `Code.gs` for emergency routing
- [ ] Test both a normal quote and an "EMERGENCY" urgency submission
- [ ] Verify red/green row highlighting in the Google Sheet
- [ ] Update service area tags to match your actual coverage
- [ ] Update the hero background (currently a CSS gradient — add a real photo if desired)
- [ ] Update social media links in footer
- [ ] Add favicon `<link rel="icon" ...>` to `<head>`
- [ ] Verify threat level badges are accurate for local pest risks
- [ ] Test on mobile — especially the booking form and pest grid
- [ ] Test Google Map embed shows correct service area

---

## 📄 License

Free for personal and commercial use. Adapt freely for your pest control business or clients.

---

<div align="center">

**Licensed. Certified. Guaranteed.**

*BioGuard — Protecting Nairobi, one home at a time.*

</div>
