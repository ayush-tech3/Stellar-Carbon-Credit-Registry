const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function checkSteps() {
    try {
        const runs = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/workflows/ci.yml/runs?per_page=1');
        const runId = runs.workflow_runs[0].id;
        
        console.log(`Run ID: ${runId}`);
        const jobs = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/${runId}/jobs`);
        
        const failedJob = jobs.jobs.find(j => j.name.includes('Contracts'));
        if (failedJob) {
            console.log(`Job: ${failedJob.name} - ${failedJob.conclusion}`);
            for (const step of failedJob.steps) {
                console.log(`  Step ${step.number}: ${step.name} - ${step.conclusion || step.status}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
checkSteps();
