const https = require('https');
const fs = require('fs');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
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

async function fetchLogs() {
    try {
        const runsRes = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs?per_page=1');
        const runs = JSON.parse(runsRes.data.toString());
        const runId = runs.workflow_runs[0].id;
        
        console.log(`Run ID: ${runId}`);
        const logRes = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/${runId}/logs`);
        
        if (logRes.statusCode === 403 || logRes.statusCode === 401) {
            console.log('API requires auth for logs zip too.');
        } else {
            fs.writeFileSync('logs.zip', logRes.data);
            console.log('Saved logs.zip');
        }
    } catch (e) {
        console.error(e);
    }
}
fetchLogs();
