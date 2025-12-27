# FBL Hexplorer Companion

![Logo](img/icons/logo.svg)

A web-based digital companion for **Forbidden Lands** RPG hex exploration sessions. This tool helps Game Masters and players track weather, terrain, travel, and campaign progress during hexcrawl adventures.

## Features

### Hexflower Weather System
The main feature that motivated the creation of this tool. Uses the hexflower navigation method - a popular technique in the hexcrawl community - to make weather progression less random and more believable. Weather changes based on 2d6 rolls that move to adjacent hexagons on the weather map.

### Temperature Tracking
Roll 1d12 (with modifiers based on weather hexagon) to determine temperature conditions:
- **Mild** - No changes
- **Hot/Cold** - Requires water consumption or endurance rolls
- **Scorching/Biting** - Extreme conditions with additional penalties

### Terrain Management
Track terrain types with automatic modifiers for:
- Movement (Open, Difficult, or Blocked terrain)
- Foraging rolls
- Hunting rolls
- Making camp rolls
- Leading the way (pathfinding) rolls

### Calendar System
Full calendar implementation with:
- 8 months following Forbidden Lands seasons (Springrise through Winterwane)
- Day/Night cycle with lighting conditions per quarter
- Quarter-day tracking (Morning, Afternoon, Dusk, Night)

### Travel Journal
Keep notes and records of your journey:
- Rich text editor with formatting options
- Day-by-day history tracking
- Save and review past entries

### Oracle Deck
A card-based oracle system following Book of Beasts rules for solo play:
- Answer yes/no questions
- 50% Chance, Likely, and Unlikely probability options
- Full 52-card deck simulation

### Dice Roller
Roll dice in Forbidden Lands format:
- Attribute, Skill, and Equipment dice
- Push roll functionality
- Artifact die support
- Visual results display

### Save/Load System
- Export campaign state to JSON file
- Import saved states to continue later
- Automatic browser cache backup

### Localization
Full support for:
- Portuguese (pt)
- English (en)

## How to Use

1. **Start Journey**: Click this button to set up your campaign's initial configuration
2. **Start Date**: Choose the day, month and year of your campaign's start
3. **Weather**: Select the initial weather on the hexflower map
4. **Temperature**: Roll 1d12 (with modifiers) to determine temperature
5. **Terrain**: Select the current terrain type
6. **Travel**: Use the **HIKE** and **STAY** buttons to advance through the day

### Daily Progression
- At the end of each day, roll 2d6 to determine weather change
- The result moves weather to an adjacent hexagon on the hexflower
- Roll on the temperature table for the new day

## Project Structure

```
Hexflower/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # Core game logic and state management
├── locales.json        # i18n translations (PT/EN)
├── scripts/
│   ├── deck.js         # Oracle deck functionality
│   ├── dice-roller.js  # Dice rolling mechanics
│   ├── hexweather.js   # Weather hexflower data
│   └── i18n.js         # Internationalization system
└── img/
    ├── icons/          # UI icons and buttons
    ├── months/         # Month-themed images
    ├── terrains/       # Terrain-themed images
    └── weather/        # Weather-themed images
```

## Technologies

- **HTML5** - Structure and semantics
- **CSS3** - Styling with responsive design
- **Vanilla JavaScript** - All functionality without frameworks
- **LocalStorage** - Browser-based state persistence and file saving/loading for backup

## Running Locally

Simply open `index.html` in any modern web browser. No build process or server required.

## About the Project

This tool was created with solo games in mind, but works great for group sessions as well. The weather hexflower house-rule received the most attention during development.

The rules, bonuses, and penalties used are an amalgam of information from:
- Forbidden Lands Gamemaster's Guide
- Book of Beasts
- Community materials

All adjusted to personal taste and gameplay experience.

## Disclaimer

*This project is an independent tool created by a fan and has no intention of violating copyrights. It does not contain, reproduce or distribute copyrighted material from the Forbidden Lands tabletop RPG system, which is the property of Free League Publishing. All rights to Forbidden Lands belong exclusively to their respective holders.*

## License

This is a fan-made project for personal use.
