const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../app/projects/vlsi/page.tsx');
const srcCode = fs.readFileSync(srcPath, 'utf8');

const pagesToCreate = [
    { dir: 'hardware', title: 'Hardware, PCB & Embedded Systems' },
    { dir: 'robotics', title: 'Robotics & Automation' },
    { dir: 'software', title: 'Software & Web Development' },
    { dir: 'structural', title: 'Structural Analysis' },
    { dir: 'design', title: '2D and 3D Design' },
    { dir: 'research', title: 'Research, Innovation & Documentation' },
    { dir: 'all', title: 'All Projects' }
];

pagesToCreate.forEach(page => {
    const dirPath = path.join(__dirname, '../app/projects', page.dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Replace the title 'VLSI and Semiconductor' with the new page title
    // Also replace the component name VLSIPage to something valid
    const compName = page.dir.charAt(0).toUpperCase() + page.dir.slice(1) + 'Page';
    let newCode = srcCode
        .replace(/VLSI and Semiconductor/g, page.title)
        .replace(/export default function VLSIPage\(\)/g, `export default function ${compName}()`);
        
    fs.writeFileSync(path.join(dirPath, 'page.tsx'), newCode, 'utf8');
    console.log(`Created ${page.dir}/page.tsx`);
});
