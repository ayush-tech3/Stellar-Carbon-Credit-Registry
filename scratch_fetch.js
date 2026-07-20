const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js', 'Accept': 'application/vnd.github.v3+json' } }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    console.log('Waiting for CI to finish...');
    let finished = false;
    while (!finished) {
        const runs = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/workflows/ci.yml/runs?per_page=1');
        const latestRun = runs.workflow_runs[0];
        
        if (latestRun.status === 'completed') {
            finished = true;
            console.log(`\nRun #${latestRun.run_number} (${latestRun.head_sha.slice(0,7)}) is completed with conclusion: ${latestRun.conclusion}`);
            
            const jobs = await get(latestRun.jobs_url);
            const contractsJob = jobs.jobs.find(j => j.name.includes('Contracts'));
            if (contractsJob) {
                console.log(`Contracts job conclusion: ${contractsJob.conclusion}`);
                for (const step of contractsJob.steps) {
                    const marker = step.conclusion === 'failure' ? '❌' : (step.conclusion === 'success' ? '✅' : '⏭️');
                    console.log(`${marker} Step ${step.number}: ${step.name} (${step.conclusion || step.status})`);
                }
            }
        } else {
            console.log(`Run #${latestRun.run_number} is still ${latestRun.status}...`);
            await sleep(10000); // Poll every 10 seconds
        }
    }
})();
