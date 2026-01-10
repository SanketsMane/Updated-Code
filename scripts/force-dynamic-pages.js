
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles || [];

    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file === 'page.tsx') {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

const targetDirs = [
    'app/dashboard',
    'app/admin',
    'app/teacher',
    'app/(public)' // Include public pages to be safe, though we manual fixed some
];

let allPages = [];
targetDirs.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    const pages = getAllFiles(fullDir);
    allPages = allPages.concat(pages);
});

console.log(`Found ${allPages.length} pages in target directories.`);

let modifiedCount = 0;

allPages.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if it already has export const dynamic
    if (content.includes('export const dynamic')) {
        // console.log(`Skipping ${path.relative(process.cwd(), fullPath)} (already dynamic)`);
        return;
    }

    // Check if it's a client component ("use client")
    // Client components cannot export dynamic config (it's ignored or errors depending on next version, or applies to parent)
    // Actually, in App Router, layout/page can export dynamic even if they have "use client"? 
    // No, "use client" pages are leaf components. The route segment config must be in a server component or the same file if it's a page.
    // Wait, if a page is "use client", it can still export route segment config?
    // Next.js docs say: "Route Segment Options... can be exported from ... page.js, route.js, layout.js ... regardless of whether logic is server or client."
    // So it SHOULD be fine.

    const lines = content.split('\n');
    let lastImportIndex = -1;
    let firstExportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('import ') || line.startsWith('require(')) {
            lastImportIndex = i;
        }
        if (firstExportIndex === -1 && (line.startsWith('export ') || line.startsWith('export async') || line.startsWith('export default'))) {
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
