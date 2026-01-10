
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (file === 'route.ts') {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

const apiDir = path.join(process.cwd(), 'app/api');
if (!fs.existsSync(apiDir)) {
    console.error('app/api directory not found!');
    process.exit(1);
}

const apiRoutes = getAllFiles(apiDir);
console.log(`Found ${apiRoutes.length} API routes.`);

let modifiedCount = 0;

apiRoutes.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if it already has export const dynamic
    if (content.includes('export const dynamic')) {
        console.log(`Skipping ${path.relative(process.cwd(), fullPath)} (already dynamic)`);
        return;
    }

    const lines = content.split('\n');
    let lastImportIndex = -1;
    let firstExportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('import ') || line.startsWith('require(')) {
            lastImportIndex = i;
        }
        if (firstExportIndex === -1 && (line.startsWith('export ') || line.startsWith('export async'))) {
            firstExportIndex = i;
        }
    }

    // Determine insertion point
    let insertIndex = 0;
    if (lastImportIndex !== -1) {
        insertIndex = lastImportIndex + 1;
    } else if (firstExportIndex !== -1) {
        insertIndex = firstExportIndex;
    }

    // Insert lines
    lines.splice(insertIndex, 0, '', 'export const dynamic = "force-dynamic";');

    const newContent = lines.join('\n');
    fs.writeFileSync(fullPath, newContent);
    console.log(`Updated ${path.relative(process.cwd(), fullPath)}`);
    modifiedCount++;
});

console.log(`\nProcess completed. Modified ${modifiedCount} files.`);
