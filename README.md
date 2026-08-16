# El Pollo Loco - Jump'n'Run Adventure

An action-packed 2D platformer featuring pixel-art characters, strategic boss battles, and
responsive gameplay. Built with vanilla JavaScript following clean code principles.

---

## Live

| Environment | URL                                                                         |
| ----------- | --------------------------------------------------------------------------- |
| **Game**    | [el-pollo-loco.dev2ksoftware.com](https://el-pollo-loco.dev2ksoftware.com/) |

---

## Preview

![Game Screenshot](./assets/img/preview-el-pollo-loco.png)

---

## Gameplay

Control **Pepe** through a desert world, collect coins & bottles, defeat chicken mobs, and
challenge the final boss.

**Key Features:**

- Dynamic mechanics with jump/throw combos
- 5+ character animations (Idle, Jump, Hurt, Dead)
- 3 enemy types + unique boss behavior
- Interactive status bars for health/coins/ammo
- SFX & background music
- Mobile touch controls with SVG icons
- Local storage for sound settings
- PWA support with offline capabilities
- Responsive design with orientation detection

---

## Technologies

- Clean code architecture with handler pattern for separation of concerns
- Max 14 lines per function, single responsibility principle
- Arrow functions with consistent coding conventions
- Modular handler system (Collision, Render, Throw, Heal, Alert)
- OOP architecture with class-based inheritance
- Canvas-based rendering with parallax scrolling
- Modular audio system with random sound pools
- SVG icons for UI elements
- Device orientation detection for mobile optimization
- Progressive Web App (PWA) ready
- JSDoc documentation for all classes and methods

---

## Architecture

### Handler Pattern

The game uses a modular handler architecture to separate concerns and improve
maintainability:

- **CollisionHandler** - collision detection and physics interactions
- **RenderHandler** - canvas rendering, parallax effects, object drawing
- **ThrowHandler** - bottle throwing mechanics and UI prompts
- **HealHandler** - healing system and coin-to-health conversion
- **AlertHandler** - enemy alert states and boss behavior

### Clean Code Principles

- Single responsibility - each class/handler has one clear purpose
- Max 14 lines - all functions kept concise and readable
- No nested functions - flat structure with extracted helpers
- Arrow functions - consistent ES6+ syntax (except constructors/event handlers)
- DRY - reusable helper methods extracted
- Complete JSDoc documentation for all public methods

---

## Local Development

```bash
pnpm install
pnpm run dev
# → opens http://localhost:3001
```

Alternatively, without the dev server:

```bash
npx serve .
```

---

## Structure

```text
el-pollo-loco/
├── assets/
│   ├── audio/                       # Sound effects & music
│   ├── fonts/                       # Custom webfonts (Creepster, Lexend)
│   ├── img/                         # Game sprites & backgrounds
│   ├── social/                      # Social media icons
│   ├── vector/                      # SVG control icons
│   └── web-app/                     # PWA icons & manifest
│
├── js/
│   ├── game.js                      # Main game initialization
│   ├── global.js                    # Global variables & settings
│   ├── script.js                    # UI interactions & menu controls
│   ├── fullscreen.js                # Fullscreen API management
│   ├── display-handler.js           # Display & device detection
│   └── includeHTML.js               # Dynamic template loading
│
├── models/                          # Game object classes
│   ├── world.class.js               # Game world orchestration
│   ├── character.class.js           # Player character
│   ├── *-handler.class.js           # collision / render / throw / heal / alert
│   ├── enemy-*.class.js             # endboss, chicken, chick, counterStrike
│   ├── object-*.class.js            # drawable, movable, throwable, pickable
│   ├── map-*.class.js               # background, cloud, bottle, coin
│   ├── status-bar-*.class.js        # health, boss, coin, bottle bars
│   ├── audio-class.js               # Audio manager
│   ├── keyboard.class.js            # Input handling
│   ├── level.class.js               # Level structure
│   └── static.class.js              # Static assets manager
│
├── levels/
│   └── level1.js                    # Level configuration & enemies
│
├── templates/                       # HTML templates (imprint, settings, story)
├── style/                           # Stylesheets (style, imprint, settings, story)
└── index.html                       # Entry point
```

---

## Controls

### Desktop

- **Arrow Keys** / **A/D** - move left/right
- **Space** - jump
- **D** - throw bottle
- **H** - heal (when health pack available)

### Mobile

- Touch controls - on-screen buttons with SVG icons
- Auto-rotation prompt for optimal landscape gameplay

---

## PWA Features

- Offline support with service worker
- Install prompt for mobile & desktop
- Responsive icons (32px - 512px)
- Manifest configuration with theme colors
- Optimized caching strategy

---

## JSDoc

```bash
pnpm run docs         # generate into docs/
pnpm run docs:serve   # serve locally on port 8081
```

---

## Assets Attribution

- **Images:** [Pixabay](https://pixabay.com/)
- **Audio:** [Freesound](https://freesound.org/)
- **Fonts:** [Google Fonts](https://fonts.google.com/), [Google Webfonts Helper](https://gwfh.mranftl.com/fonts/)
- **Icons & Vectors:** [SVG Repo](https://www.svgrepo.com/), [FontAwesome](https://fontawesome.com/)

---

## License

This project is for educational purposes. All assets are attributed to their respective
sources.

---

## Developer

**Konstantin Aksenov**

- [GitHub](https://github.com/KosMaster87)
- [konstantin@dev2ksoftware.com](mailto:konstantin@dev2ksoftware.com)
