# 🐔 El Pollo Loco - Jump'n'Run Adventure

An action-packed 2D platformer featuring charming pixel-art characters, strategic boss battles, and responsive gameplay. Built with vanilla JavaScript following clean code principles and modern web standards.

---

## 🚀 Live Demo

🔗 [Live Demo – el-pollo-loco.dev2k.org](https://el-pollo-loco.dev2k.org/)

---

## 📸 Preview

![Game Screenshot](./assets/img/preview-el-pollo-loco.png)

---

## 🎮 Gameplay

Control **Pepe** through a desert world, collect coins & bottles, defeat chicken mobs, and challenge the final boss!

**Key Features:**

- 🕹️ Dynamic mechanics with jump/throw combos
- 🎭 5+ character animations (Idle, Jump, Hurt, Dead)
- 🐓 3 enemy types + unique boss behavior
- 📊 Interactive status bars for health/coins/ammo
- 🔊 Immersive SFX & background music
- 📱 Mobile touch controls with SVG icons
- 💾 Local storage for sound settings
- 🌐 PWA support with offline capabilities
- 🎨 Responsive design with orientation detection

---

## 🛠️ Technologies

- **OOP architecture** with separated concerns
- **Canvas-based rendering** for smooth animations
- **Modular audio system** with random sound pools
- **SVG icons** for modern UI elements
- **Device orientation detection**
- **Progressive Web App (PWA)** ready
- **JSDoc documentation** for core classes

---

## ▶️ Installation

1. Clone repository:

   ```bash
   git clone https://github.com/KosMaster87/El-pollo-loco
   ```

2. Open in browser:
   ```bash
   cd El-pollo-loco && open index.html
   ```
   Or use a local server:
   ```bash
   npx serve
   ```

---

## 📁 Project Structure

```text
el-pollo-loco/
├── assets/
│   ├── audio/                       # Sound effects & music
│   ├── fonts/
│   │   └── comic/                   # Custom webfonts (Creepster, Lexend)
│   ├── img/                         # Game sprites & backgrounds
│   │   ├── 2_character_pepe/
│   │   ├── 3_enemies_chicken/
│   │   ├── 4_enemie_boss_chicken/
│   │   ├── 5_background/
│   │   ├── 6_salsa_bottle/
│   │   ├── 7_statusbars/
│   │   ├── 8_coin/
│   │   ├── 9_intro_outro_screens/
│   │   └── 10_menu/
│   ├── social/                      # Social media icons (GitHub, LinkedIn, etc.)
│   ├── vector/
│   │   └── arrows/                  # SVG control icons
│   └── web-app/                     # PWA icons & manifest
│
├── js/
│   ├── game.js                      # Main game loop
│   ├── global.js                    # Global variables & settings
│   ├── script.js                    # UI interactions
│   └── includeHTML.js               # Dynamic template loading
│
├── models/                          # Game object classes
│   ├── character.class.js
│   ├── enemy-*.class.js
│   ├── world.class.js
│   ├── audio-class.js
│   └── ...
│
├── levels/
│   └── level1.js                    # Level configuration
│
├── templates/                       # HTML templates
│   ├── imprint.html
│   ├── settings.html
│   └── story.html
│
├── style/                           # Stylesheets
│   ├── style.css                    # Main styles
│   ├── imprint.css
│   ├── settings.css
│   └── story.css
│
└── index.html                       # Entry point
```

---

## 🎮 Controls

### Desktop

- **Arrow Keys** / **A/D** - Move left/right
- **Space** - Jump
- **D** - Throw bottle
- **H** - Heal (when health pack available)

### Mobile

- **Touch controls** - On-screen buttons with SVG icons
- **Auto-rotation prompt** - For optimal landscape gameplay

---

## 🌐 PWA Features

- **Offline support** with service worker
- **Install prompt** for mobile & desktop
- **Responsive icons** (32px - 512px)
- **Manifest configuration** with theme colors
- **Optimized caching** strategy

---

## 🎨 Assets Attribution

- **Images:** [Pixabay](https://pixabay.com/)
- **Audio:** [Freesound](https://freesound.org/)
- **Fonts:** [Google Fonts](https://fonts.google.com/), [Google Webfonts Helper](https://gwfh.mranftl.com/fonts/)
- **Icons & Vectors:** [SVG Repo](https://www.svgrepo.com/), [FontAwesome](https://fontawesome.com/)

---

## 📝 License

This project is for educational purposes. All assets are attributed to their respective sources.

---

## 👨‍💻 Developer

**Konstantin Aksenov**
🔗 [GitHub](https://github.com/KosMaster87)
📧 [Konstantin.Aksenov@dev2k.org](mailto:Konstantin.Aksenov@dev2k.org)

---

## 🔄 Version

**Current Branch:** `remaster`
**Status:** Active Development

---
