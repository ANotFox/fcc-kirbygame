## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)

## Description

This project is a Kirby-inspired game developed as part of a FreeCodeCamp (FCC) project. It uses the Kaboom game engine, TypeScript, and Vite for fast development and bundling. The game features a map system with colliders and spawn points, all managed through JSON map data.

## Installation

To set up and run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fcc-kirbygame.git
   cd fcc-kirbygame
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The game should now be accessible in your browser at `http://localhost:5173`.

## Usage

### Running the Game

- **Development**: Use `npm run dev` to start the development server.
- **Building for Production**: Use `npm run build` to compile the TypeScript code and bundle the project with Vite.

### Game Mechanics

The game uses a map system defined in JSON files. The `makemap` utility function in `src/utils.ts` loads the map data and sets up colliders and spawn points. The game scales objects using the `scale` constant defined in `src/constants.ts`.

## Project Structure

```
fcc-kirbygame/
├── package.json          # Project configuration and dependencies
├── index.html            # Main HTML file for the game
├── vite.config.ts        # Vite configuration
├── src/
│   ├── constants.ts      # Game constants (e.g., scale)
│   ├── utils.ts          # Utility functions (e.g., map creation)
│   └── main.ts           # Main game logic (not provided in context)
├── dist/                 # Output directory for production build
└── node_modules/         # Installed dependencies
```

## Dependencies

### Development Dependencies
- **TypeScript** (`^5.2.2`) | **Vite** (`^5.2.14`)

### Runtime Dependencies
- **Kaboom** (`^3000.1.17`): A JavaScript library for creating games.

## Contributing

The repo is inactive.
