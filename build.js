const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

let htmlContent = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const talksContent = fs.readFileSync(path.join(srcDir, 'talks.json'), 'utf8');
const scriptContent = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');

// Embed CSS
htmlContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);

// Embed JSON data and script
const finalScript = `
<script>
    const talksData = ${talksContent};
    ${scriptContent}
</script>
`;
htmlContent = htmlContent.replace('</body>', `${finalScript}</body>`);

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);

console.log('Build complete! Your serverless website is ready in dist/index.html');
