# Primelo — Custom Luxury Watches

A modern, 3D-powered website for Primelo, a custom luxury watch company.

## Features

- **3D Watch Hero** — Interactive Three.js watch model that rotates 360° as visitors scroll
- **Product Showcase** — Grid layout for custom watch collections
- **Scroll Animations** — Smooth reveal effects powered by GSAP + ScrollTrigger
- **Responsive Design** — Fully responsive across all devices
- **Modern Color Palette** — Deep navy, gold accents, and clean whites for a trustworthy luxury feel
- **Particle Background** — Subtle animated particle network
- **Contact Form** — Inquiry form for custom watch builds

## Tech Stack

- **Three.js** — 3D watch rendering
- **GSAP + ScrollTrigger** — Scroll-driven animations
- **Vanilla HTML/CSS/JS** — No framework overhead, fast loading
- **Google Fonts** — Playfair Display + Inter

## Getting Started

Simply open `index.html` in a browser, or serve with any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

## Project Structure

```
primelo/
├── index.html          # Main page
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # 3D watch, animations, interactions
├── assets/             # Images and assets (add product photos here)
└── README.md
```

## Customization

- **Products**: Edit the product cards in `index.html` to add your own watches
- **Colors**: Modify CSS variables in `css/styles.css` under `:root`
- **3D Watch**: Customize materials and geometry in `js/main.js`
