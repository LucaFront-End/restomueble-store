import fs from 'fs';
fetch('http://localhost:3000/tienda').then(r => r.text()).then(html => {
    const urls = html.match(/https:\/\/static\.wixstatic\.com\/media\/[^\"?]+/g);
    if (urls) {
        fs.writeFileSync('wix-images.txt', [...new Set(urls)].slice(0, 10).join('\n'));
    }
});
