const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
            let data = '';
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(get(res.headers.location));
            }
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    resolve(data); // just resolve with data anyway
                }
            });
        }).on('error', reject);
    });
}

async function fetchLog() {
    try {
        const runsJson = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs?per_page=1');
        const runs = JSON.parse(runsJson);
        const runId = runs.workflow_runs[0].id;
        
        const jobsJson = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/${runId}/jobs`);
        const jobs = JSON.parse(jobsJson);
        
        const failedJob = jobs.jobs.find(j => j.conclusion === 'failure');
        if (!failedJob) {
            console.log('No failed jobs found in the latest run.');
            return;
        }
        
        console.log(`Failed job: ${failedJob.name}`);
        const log = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/jobs/${failedJob.id}/logs`);
        
        // Print the last 100 lines of the log
        const lines = log.split('\n');
        console.log(lines.slice(Math.max(lines.length - 150, 0)).join('\n'));
    } catch (e) {
        console.error(e);
    }
}
fetchLog();
