const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STELLAR_CLI = path.resolve(__dirname, '..', 'stellar.exe');
const RETIRE_CONTRACT_ID = 'CBDL7CHTWLZDJ6GXPAXX5FL53WY2VL342XY622OIQ3NTVPU7HCSWHAMA';
const NETWORK = 'testnet';
const DEPLOYER_ALIAS = 'test-deployer';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const stdout = execSync(cmd, { encoding: 'utf8' });
    console.log(stdout.trim());
    return stdout.trim();
  } catch (err) {
    console.error(`Error:`, err.stdout || err.message);
    throw err;
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('=== Step 1: Getting deployer address ===');
  const deployerAddr = run(`"${STELLAR_CLI}" keys address ${DEPLOYER_ALIAS}`);
  console.log(`Deployer Address: ${deployerAddr}`);

  const regContractId = 'CAKKATMEKPX6BYMDIDFFDVADSJEFARV47R5VKFWXVK75HOCH455YWMVW';
  console.log(`Using Live Registry Contract ID: ${regContractId}`);

  console.log('\n=== Step 6: Creating 12 Real Testnet User Wallets ===');
  const userProfiles = [
    { name: 'wallet-amazon-conservation', role: 'Amazon Reforestation Project Issuer', isIssuer: true },
    { name: 'wallet-rajasthan-solar', role: 'Rajasthan Clean Solar Developer', isIssuer: true },
    { name: 'wallet-northsea-wind', role: 'North Sea Wind Park Operator', isIssuer: true },
    { name: 'wallet-iceland-dac', role: 'Direct Air Capture Carbon Removal', isIssuer: true },
    { name: 'wallet-ecotrade-broker', role: 'EcoTrade Institutional Broker', isIssuer: false },
    { name: 'wallet-green-fund-mgmt', role: 'Global ESG Alpha Asset Fund', isIssuer: false },
    { name: 'wallet-logistics-corp', role: 'Global Logistics Supply Chain (Retiree)', isIssuer: false },
    { name: 'wallet-airline-offsets', role: 'AeroSky Airlines Net-Zero Fleet (Retiree)', isIssuer: false },
    { name: 'wallet-tech-cloud-datacenter', role: 'Cloud Compute Infrastructure (Retiree)', isIssuer: false },
    { name: 'wallet-maritime-carrier', role: 'Nordic Ocean Shipping Lines (Retiree)', isIssuer: false },
    { name: 'wallet-esg-audit-verifier', role: 'Verra & Gold Standard ESG Auditor', isIssuer: false },
    { name: 'wallet-compliance-inspector', role: 'Carbon Credit Compliance Inspector', isIssuer: false }
  ];

  const onboardedWallets = [];

  for (let i = 0; i < userProfiles.length; i++) {
    const profile = userProfiles[i];
    console.log(`\nChecking / generating wallet ${i+1}/${userProfiles.length}: ${profile.name}...`);
    try {
      const addr = run(`"${STELLAR_CLI}" keys address ${profile.name}`);
      profile.address = addr;
    } catch(e) {
      run(`"${STELLAR_CLI}" keys generate ${profile.name} --network ${NETWORK} --fund`);
      profile.address = run(`"${STELLAR_CLI}" keys address ${profile.name}`);
    }
    onboardedWallets.push(profile);
  }

  console.log('\n=== Step 7: Authorizing Issuers on-chain ===');
  for (const wallet of onboardedWallets) {
    if (wallet.isIssuer) {
      console.log(`Authorizing ${wallet.role} (${wallet.address})...`);
      try {
        run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${DEPLOYER_ALIAS} --network ${NETWORK} -- add_issuer --issuer ${wallet.address}`);
      } catch(e) {
        console.log(`Issuer already added or warning:`, e.message);
      }
      await sleep(1000);
    }
  }

  console.log('\n=== Step 8: Issuing Real Carbon Credits on-chain ===');
  const projectBatches = [
    { issuer: onboardedWallets[0], project: 'Amazon Rainforest Protection', amount: '10000', vintage: 2025, method: 'VCS-REDD+' },
    { issuer: onboardedWallets[1], project: 'Rajasthan Mega Solar Park', amount: '8500', vintage: 2025, method: 'Gold-Standard' },
    { issuer: onboardedWallets[2], project: 'North Sea Offshore Wind', amount: '12000', vintage: 2024, method: 'VCS-Renewable' },
    { issuer: onboardedWallets[3], project: 'Iceland Geothermal DAC Carbon Removal', amount: '2500', vintage: 2025, method: 'CDR-DAC' }
  ];

  const issuedCredits = [];
  for (let i = 0; i < projectBatches.length; i++) {
    const batch = projectBatches[i];
    console.log(`\nIssuing credits for ${batch.project} (${batch.amount} tCO2)...`);
    try {
      const issueOut = run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${batch.issuer.name} --network ${NETWORK} -- issue_credits --issuer ${batch.issuer.address} --project "${batch.project}" --amount ${batch.amount} --vintage ${batch.vintage} --method "${batch.method}"`);
      issuedCredits.push({ creditId: i, ...batch });
    } catch(e) {
      console.log(`Batch ${i} issue notice:`, e.message);
      issuedCredits.push({ creditId: i, ...batch });
    }
    await sleep(1500);
  }

  console.log('\n=== Step 9: Transferring Credits to Traders & Corporations ===');
  // Transfer 1: Amazon -> EcoTrade Broker (3,000 tCO2 from credit #0)
  console.log('Transfer 1: Amazon -> EcoTrade Broker (3,000 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[0].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[0].address} --to ${onboardedWallets[4].address} --credit_id 0 --amount 3000`);
  await sleep(1500);

  // Transfer 2: EcoTrade Broker -> Logistics Corp (1,500 tCO2 from credit #0)
  console.log('Transfer 2: EcoTrade Broker -> Logistics Corp (1,500 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[4].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[4].address} --to ${onboardedWallets[6].address} --credit_id 0 --amount 1500`);
  await sleep(1500);

  // Transfer 3: Solar -> Green Alpha Fund (2,500 tCO2 from credit #1)
  console.log('Transfer 3: Solar -> Green Alpha Fund (2,500 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[1].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[1].address} --to ${onboardedWallets[5].address} --credit_id 1 --amount 2500`);
  await sleep(1500);

  // Transfer 4: Green Alpha Fund -> Airline Offsets (2,000 tCO2 from credit #1)
  console.log('Transfer 4: Green Alpha Fund -> Airline Offsets (2,000 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[5].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[5].address} --to ${onboardedWallets[7].address} --credit_id 1 --amount 2000`);
  await sleep(1500);

  // Transfer 5: Wind -> Tech Datacenter (4,000 tCO2 from credit #2)
  console.log('Transfer 5: Wind -> Tech Datacenter (4,000 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[2].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[2].address} --to ${onboardedWallets[8].address} --credit_id 2 --amount 4000`);
  await sleep(1500);

  // Transfer 6: DAC -> Maritime Carrier (1,000 tCO2 from credit #3)
  console.log('Transfer 6: DAC -> Maritime Carrier (1,000 tCO2)');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[3].name} --network ${NETWORK} -- transfer --from ${onboardedWallets[3].address} --to ${onboardedWallets[9].address} --credit_id 3 --amount 1000`);
  await sleep(1500);

  console.log('\n=== Step 10: Permanently Retiring Carbon Offsets (Cross-Contract Burn) ===');
  // Retirement 1: Logistics Corp retires 1,200 tCO2 from Amazon credit #0
  console.log('Retirement 1: Logistics Corp retires 1,200 tCO2');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[6].name} --network ${NETWORK} -- retire --owner ${onboardedWallets[6].address} --credit_id 0 --amount 1200`);
  await sleep(1500);

  // Retirement 2: Airline Fleet retires 1,800 tCO2 from Solar credit #1
  console.log('Retirement 2: Airline Fleet retires 1,800 tCO2');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[7].name} --network ${NETWORK} -- retire --owner ${onboardedWallets[7].address} --credit_id 1 --amount 1800`);
  await sleep(1500);

  // Retirement 3: Tech Cloud Datacenter retires 3,500 tCO2 from Wind credit #2
  console.log('Retirement 3: Tech Cloud Datacenter retires 3,500 tCO2');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[8].name} --network ${NETWORK} -- retire --owner ${onboardedWallets[8].address} --credit_id 2 --amount 3500`);
  await sleep(1500);

  // Retirement 4: Maritime Carrier retires 800 tCO2 from DAC credit #3
  console.log('Retirement 4: Maritime Carrier retires 800 tCO2');
  run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[9].name} --network ${NETWORK} -- retire --owner ${onboardedWallets[9].address} --credit_id 3 --amount 800`);
  await sleep(1500);

  console.log('\n=== Step 11: Auditor & Compliance Verifications (View Calls) ===');
  const credit1Details = run(`"${STELLAR_CLI}" contract invoke --id ${regContractId} --source-account ${onboardedWallets[10].name} --network ${NETWORK} --is-view -- get_credit --credit_id 0`);
  console.log('Auditor Credit #0 View:', credit1Details);

  const totalRetiredTons = run(`"${STELLAR_CLI}" contract invoke --id ${RETIRE_CONTRACT_ID} --source-account ${onboardedWallets[11].name} --network ${NETWORK} --is-view -- get_total`);
  console.log('Total Global Retired Tons in Retirement Ledger:', totalRetiredTons);

  const results = {
    deployedAt: new Date().toISOString(),
    network: NETWORK,
    deployer: {
      alias: DEPLOYER_ALIAS,
      address: deployerAddr
    },
    contracts: {
      carbonCreditRegistry: regContractId,
      retirementManager: RETIRE_CONTRACT_ID
    },
    wallets: onboardedWallets,
    totalRetiredTons: totalRetiredTons
  };

  fs.writeFileSync(path.resolve(__dirname, 'deployment-live.json'), JSON.stringify(results, null, 2));
  console.log('\n🎉 ALL LIVE TESTNET OPERATIONS SUCCESSFULLY COMPLETED!');
  console.log('Saved live details to deployment-live.json');
}

main().catch(e => {
  console.error('Fatal Error:', e);
  process.exit(1);
});
