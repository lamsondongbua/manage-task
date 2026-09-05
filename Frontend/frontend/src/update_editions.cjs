const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'EditionsPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove FluidBackground component
content = content.replace(/\/\* ═══════════════════════════════════════════════════════════════\r?\n   FLUID BACKGROUND\r?\n═══════════════════════════════════════════════════════════════ \*\/\r?\nfunction FluidBackground\(\{[^\}]+\}\) \{[\s\S]*?\}\r?\n\r?\n/m, '');

// Remove ParticleCanvas component
content = content.replace(/\/\* ═══════════════════════════════════════════════════════════════\r?\n   PARTICLE CANVAS\r?\n═══════════════════════════════════════════════════════════════ \*\/\r?\nfunction ParticleCanvas\(\) \{[\s\S]*?\}\r?\n\r?\n/m, '');

// Remove CursorGlow component
content = content.replace(/\/\* ═══════════════════════════════════════════════════════════════\r?\n   CURSOR GLOW\r?\n═══════════════════════════════════════════════════════════════ \*\/\r?\nfunction CursorGlow\(\{[^\}]+\}\) \{[\s\S]*?\}\r?\n\r?\n/m, '');

// Update imports
const imports = `import FluidBackground from './components/ui/FluidBackground'
import ParticleCanvas from './components/ui/ParticleCanvas'
import CursorGlow from './components/ui/CursorGlow'
`;
content = content.replace(/import Lenis from '@studio-freight\/lenis'\r?\nimport '\.\/EditionsPage\.css'/, `import Lenis from '@studio-freight/lenis'\nimport './EditionsPage.css'\n${imports}`);

// Update usage of FluidBackground and CursorGlow
content = content.replace(/<FluidBackground edition=\{active\} \/>/g, '<FluidBackground color1={active.color1} color2={active.color2} color3={active.color3} />');
content = content.replace(/<CursorGlow edition=\{active\} \/>/g, '<CursorGlow color={active.color1} />');

fs.writeFileSync(filePath, content, 'utf8');
console.log('EditionsPage.jsx updated successfully.');
