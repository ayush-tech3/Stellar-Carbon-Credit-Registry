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

(async () => {
    // Get all CI runs and check which step fails for each
    const runs = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/workflows/ci.yml/runs?per_page=16');
    
    for (const run of runs.workflow_runs) {
        const jobs = await get(run.jobs_url);
        const contractsJob = jobs.jobs.find(j => j.name.includes('Contracts'));
        if (contractsJob) {
            const failedStep = contractsJob.steps.find(s => s.conclusion === 'failure');
            if (failedStep) {
                console.log(`Run #${run.run_number} (${run.head_sha.slice(0,7)}): Failed at "${failedStep.name}" (step ${failedStep.number})`);
            } else if (contractsJob.conclusion === 'success') {
                console.log(`Run #${run.run_number} (${run.head_sha.slice(0,7)}): ✅ CONTRACTS PASSED`);
            } else {
                console.log(`Run #${run.run_number} (${run.head_sha.slice(0,7)}): ${contractsJob.conclusion} - no failed step found`);
            }
        } else {
            console.log(`Run #${run.run_number}: No contracts job found`);
        }
    }
})();
