import fs from 'fs';
import path from 'path';

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

const replaceMap = [
  // Gradients
  { regex: /from-purple-[0-9]+/g, replacement: 'from-blue-500' },
  { regex: /to-pink-[0-9]+/g, replacement: 'to-cyan-400' },
  { regex: /via-purple-[0-9]+\/[0-9]+/g, replacement: 'via-blue-500/30' },
  { regex: /text-purple-[0-9]+/g, replacement: 'text-[var(--accent-primary)]' },
  { regex: /hover:text-purple-[0-9]+/g, replacement: 'hover:text-[var(--accent-primary)]' },
  { regex: /bg-purple-[0-9]+\/([0-9]+)/g, replacement: 'bg-blue-500/$1' },
  { regex: /bg-purple-[0-9]+/g, replacement: 'bg-blue-600' },
  { regex: /hover:border-purple-[0-9]+\/([0-9]+)/g, replacement: 'hover:border-blue-500/$1' },
  { regex: /focus:border-purple-[0-9]+\/([0-9]+)/g, replacement: 'focus:border-blue-500/$1' },
  { regex: /border-purple-[0-9]+\/[0-9]+/g, replacement: 'border-[var(--border-color)]' },
  { regex: /border-purple-[0-9]+/g, replacement: 'border-[var(--border-color)]' },
  { regex: /ring-purple-[0-9]+\/([0-9]+)/g, replacement: 'ring-blue-500/$1' },
  { regex: /ring-purple-[0-9]+/g, replacement: 'ring-blue-500' },
  { regex: /hover:bg-purple-[0-9]+\/([0-9]+)/g, replacement: 'hover:bg-blue-500/$1' },
  { regex: /focus:bg-purple-[0-9]+\/([0-9]+)/g, replacement: 'focus:bg-blue-500/$1' },
  { regex: /text-pink-[0-9]+/g, replacement: 'text-[var(--accent-secondary)]' },
  // Special buttons logic
  { regex: /variant="destructive"/g, replacement: 'variant="destructive"' },
];

walkSync('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove Clerk shadesOfPurple
    if (filePath.endsWith('main.jsx')) {
      content = content.replace(/import\s+{\s*shadesOfPurple\s*}\s+from\s+["']@clerk\/themes["'];?/g, '');
      content = content.replace(/baseTheme:\s*shadesOfPurple,/g, '');
    }

    if (filePath.endsWith('index.css') || filePath.endsWith('tailwind.config.js')) return;

    for (const { regex, replacement } of replaceMap) {
      if (content.match(regex)) {
        content = content.replace(regex, replacement);
      }
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
