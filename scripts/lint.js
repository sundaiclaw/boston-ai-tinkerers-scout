const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const directories = ['src', 'public', 'tests', 'scripts'];
const rootFiles = ['server.js'];
const files = [];

function collectJavaScriptFiles(targetPath) {
  const stat = fs.statSync(targetPath);

  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      collectJavaScriptFiles(path.join(targetPath, entry));
    }
    return;
  }

  if (targetPath.endsWith('.js')) {
    files.push(targetPath);
  }
}

for (const relativeFile of rootFiles) {
  if (fs.existsSync(relativeFile)) {
    collectJavaScriptFiles(relativeFile);
  }
}

for (const directory of directories) {
  if (fs.existsSync(directory)) {
    collectJavaScriptFiles(directory);
  }
}

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`Syntax check passed for ${files.length} files.`);
