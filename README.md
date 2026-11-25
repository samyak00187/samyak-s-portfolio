**Live portfolio:** [Open the website](https://samyak00187.github.io/samyak-s-portfolio/)

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

## Run the tests

The test suite uses Node's built-in test runner (no extra dependencies) and checks the Electron link policy, project-link data, and that the page's markup, styles, and scripts line up:

```powershell
npm test
```

The same suite runs in GitHub Actions on every push and pull request.

## Updating project links

Project Repo / Live / Download buttons are generated from the `CONFIG.projects` object in the inline script in `index.html`. To add a link, add an entry keyed by the exact project title used in that card's `data-k` attribute. Projects without a public repo, live site, or download intentionally have no entry and show no buttons — if you add a card, either give it a `CONFIG` entry or add its title to the allowlist in `test/portfolio.test.js`.

## Notes for Windows builds

- The portable and NSIS builds are unsigned, so Windows SmartScreen may show an "unknown publisher" prompt on first run.
- `resume.pdf` is unpacked from the app archive (`asarUnpack` in `package.json`) so the Resume button can open it in the system PDF viewer.

## Repository visibility

This repository is public. The included `resume.pdf` is therefore publicly accessible.
