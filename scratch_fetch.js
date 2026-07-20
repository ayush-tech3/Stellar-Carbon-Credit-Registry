const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js', 'Accept': 'application/vnd.github.v3+json' } }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

(async () => {
    const runs = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/workflows/ci.yml/runs?per_page=1');
    if (!runs || !runs.workflow_runs) {
        console.log("Rate limited or bad response:", runs);
        return;
    }
    const latestRun = runs.workflow_runs[0];
    
    console.log(`Run #${latestRun.run_number} (${latestRun.head_sha.slice(0,7)}) is ${latestRun.status} with conclusion: ${latestRun.conclusion}`);
    
    if (latestRun.status === 'completed') {
        const jobs = await get(latestRun.jobs_url);
        const contractsJob = jobs.jobs.find(j => j.name.includes('Contracts'));
        if (contractsJob) {
            console.log(`Contracts job conclusion: ${contractsJob.conclusion}`);
            for (const step of contractsJob.steps) {
                const marker = step.conclusion === 'failure' ? '❌' : (step.conclusion === 'success' ? '✅' : '⏭️');
                console.log(`${marker} Step ${step.number}: ${step.name} (${step.conclusion || step.status})`);
            }
        }
    }
})();
