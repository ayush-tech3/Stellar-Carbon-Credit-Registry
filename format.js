const fs = require('fs');

async function formatFiles() {
    function findRsFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const filePath = dir + '/' + file;
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory() && file !== 'target' && file !== 'node_modules' && file !== '.git') {
                results = results.concat(findRsFiles(filePath));
            } else if (file.endsWith('.rs')) {
                results.push(filePath);
            }
        }
        return results;
    }

    const files = findRsFiles('./contracts');
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        try {
            const res = await fetch('https://play.rust-lang.org/format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: content, edition: "2021" })
            });
            const data = await res.json();
            if (data.success) {
                if (content !== data.code) {
                    fs.writeFileSync(file, data.code);
                    console.log('Formatted:', file);
                }
            } else {
                console.error('Failed formatting:', file, data);
            }
        } catch (e) {
            console.error('Network error formatting:', file, e);
        }
    }
}

formatFiles();
