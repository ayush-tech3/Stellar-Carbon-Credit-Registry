const https = require('https');
const fs = require('fs');

function get(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 
                'User-Agent': 'node.js', 
                'Accept': 'application/vnd.github.v3+json'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // follow redirect
                https.get(res.headers.location, options, (res2) => {
                    let data = '';
                    res2.on('data', chunk => { data += chunk; });
                    res2.on('end', () => resolve(data));
                }).on('error', reject);
            } else {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => resolve(JSON.parse(data)));
            }
        }).on('error', reject);
    });
}

(async () => {
    // Get latest run
    const runs = await get('https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/workflows/ci.yml/runs?per_page=1');
    const runId = runs.workflow_runs[0].id;
    
    // Get jobs for the run
    const jobsData = await get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/${runId}/jobs`);
    const contractsJob = jobsData.jobs.find(j => j.name.includes('Contracts'));
    
    if (contractsJob) {
        console.log(`Getting logs for job ${contractsJob.id}...`);
        
        // Fetch raw log for the job
        const options = {
            headers: { 
                'User-Agent': 'node.js', 
                'Accept': 'application/vnd.github.v3+json'
            }
        };
        
        https.get(`https://api.github.com/repos/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/jobs/${contractsJob.id}/logs`, options, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                https.get(res.headers.location, (res2) => {
                    let log = '';
                    res2.on('data', d => log += d);
                    res2.on('end', () => {
                        fs.writeFileSync('job_log.txt', log);
                        console.log('Saved log to job_log.txt');
                        
                        // Try to find the test error
                        const lines = log.split('\n');
                        let inTest = false;
                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].includes('Run cargo test')) {
                                inTest = true;
                                console.log('--- FOUND TEST STEP ---');
                            }
                            if (inTest && (lines[i].includes('error[') || lines[i].includes('error:') || lines[i].includes('FAILED'))) {
                                // print context around error
                                for (let j = Math.max(0, i-2); j < Math.min(lines.length, i+20); j++) {
                                    console.log(lines[j]);
                                }
                            }
                        }
                    });
                });
            } else {
                console.log('Failed to get log redirect', res.statusCode);
            }
        });
    }
})();
