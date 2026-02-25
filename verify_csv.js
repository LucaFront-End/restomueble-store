const fs = require('fs');

const content = fs.readFileSync('d:/Workspace/Assets/Restomueble ecom/store/wix_products_import.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

function countFields(line) {
    let fields = 0;
    let inQuotes = false;
    for (let char of line) {
        if (char === '"') inQuotes = !inQuotes;
        if (char === ',' && !inQuotes) fields++;
    }
    return fields + 1;
}

const headerFields = countFields(lines[0]);
console.log("Header fields: " + headerFields);

lines.forEach((line, i) => {
    const fields = countFields(line);
    if (fields !== headerFields) {
        console.log("Line " + (i + 1) + " has " + fields + " fields. Expected " + headerFields);
        console.log("Content: " + line.substring(0, 50) + "...");
    }
});

if (lines.every(l => countFields(l) === headerFields)) {
    console.log("All lines have exactly " + headerFields + " fields.");
}
