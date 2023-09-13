const fs = require("fs");
const path = require("path");
const args = require("minimist")(process.argv.slice(2));

// 1. Accept a cli argument called "path" that defaults to "./src/components"
const targetPath = args.path || "./src/components";

// 2. Accept a cli argument called "name" with no default, and it should be required
if (!args.name) {
  console.error('The "name" argument is required!');
  process.exit(1);
}

const name = args.name;

// Ensure targetPath exists
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

// Create the folder with the provided "name"
const componentPath = path.join(targetPath, name);
if (!fs.existsSync(componentPath)) {
  fs.mkdirSync(componentPath);
}

// 3. Create the two files inside the newly created folder
const jsxFilePath = path.join(componentPath, `${name}.jsx`);
const cssFilePath = path.join(componentPath, `${name}.module.css`);

// Writing basic content to the files (this step is optional and can be removed if not necessary)
fs.writeFileSync(
  jsxFilePath,
  `import React from 'react';\nimport styles from './${name}.module.css';\n\nexport default function ${name}() {\n  return <div className={styles.container}>${name} Component</div>;\n}\n`
);
fs.writeFileSync(
  cssFilePath,
  `.container {\n  /* Styles for ${name} component */\n}\n`
);

console.log(`Component "${name}" created successfully at ${componentPath}`);
