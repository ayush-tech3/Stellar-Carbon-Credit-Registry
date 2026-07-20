const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js', 'Accept': 'application/vnd.github.v3+json' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(get(res.headers.location));
            }
            let data = Buffer.alloc(0);
            res.on('data', chunk => { data = Buffer.concat([data, chunk]); });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data });
            });
        }).on('error', reject);
    });
}

async function fetchChecks() {
    try {
        const runsRes = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/commits/main/check-runs');
        const runs = JSON.parse(runsRes.data.toString());
        
        for (const cr of runs.check_runs) {
            if (cr.conclusion === 'failure') {
                console.log(`Job: ${cr.name}`);
                const annRes = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/check-runs/${cr.id}/annotations`);
                console.log('Annotations:', annRes.data.toString());
            }
        }
    } catch (e) {
        console.error(e);
    }
}
fetchChecks();
