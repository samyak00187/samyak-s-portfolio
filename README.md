# Samyak Jain Portfolio

A personal portfolio showcasing Samyak Jain's work in artificial intelligence, machine learning, and full-stack development. Explore selected projects, technical skills, education, training, and contact information in an interactive portfolio packaged as a Windows desktop app with Electron.

## Features

- Portfolio sections for projects, skills, education, training, and work opportunities
- Interactive visual experience powered by the bundled Three.js library
- Links to contact and external resources open outside the desktop app
- Windows portable and installer builds

## Tech stack

- HTML, CSS, and JavaScript
- Electron 33
- Three.js
- electron-builder

## Requirements

- Node.js and npm
- Windows to build the Windows distributables

## Get started

Clone the repository and install its dependencies:

```powershell
git clone https://github.com/samyak00187/samyak-s-portfolio.git
cd samyak-s-portfolio
npm install
```

Start the portfolio desktop app:

```powershell
npm start
```

## Build for Windows

Create the portable app and Windows installer:

```powershell
npm run dist
```

Build artifacts are written to the `dist` directory.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Portfolio interface and content |
| `main.js` | Electron window setup and external-link handling |
| `three.min.js` | Bundled Three.js library |
| `icon.png` | App icon |
| `og.png` | Social preview image |
| `resume.pdf` | Portfolio resume |
| `package.json` | App metadata, scripts, and build configuration |

## Repository visibility

This repository is public. The included `resume.pdf` is therefore publicly accessible.
