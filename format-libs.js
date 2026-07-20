const fs = require('fs');

async function formatLib(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "mod something;" with "mod something {}"
    const modRegex = /^(\s*(?:#\[cfg[^\]]+\]\s*)?pub\s+mod\s+\w+|mod\s+\w+);/gm;
    let modifiedContent = content.replace(modRegex, '$1 {}');
    
    // Also replace the retirement module import
    const importRegex = /soroban_sdk::contractimport!\([^)]+\);/g;
    let originalImports = [];
    modifiedContent = modifiedContent.replace(importRegex, (match) => {
        originalImports.push(match);
        return '/*REPLACED_IMPORT*/';
    });

    try {
        console.log('Formatting', filePath);
        const res = await fetch('https://play.rust-lang.org/format', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: modifiedContent, edition: "2021" })
        });
        const data = await res.json();
        
        if (data.success) {
            let newContent = data.code;
            
            // Revert "mod something {}" back to "mod something;"
            const emptyModRegex = /^(\s*(?:#\[cfg[^\]]+\]\s*)?pub\s+mod\s+\w+|mod\s+\w+)\s*\{\}/gm;
            newContent = newContent.replace(emptyModRegex, '$1;');
            
            // Revert imports
            let importIndex = 0;
            newContent = newContent.replace(/\/\*REPLACED_IMPORT\*\//g, () => {
                return originalImports[importIndex++];
            });
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent);
                console.log('Formatted:', filePath);
            } else {
                console.log('No formatting changes for:', filePath);
            }
        } else {
            console.error('Failed formatting:', filePath, data);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

async function run() {
    await formatLib('./contracts/carbon-credit-registry/src/lib.rs');
    await formatLib('./contracts/retirement-manager/src/lib.rs');
}
run();
