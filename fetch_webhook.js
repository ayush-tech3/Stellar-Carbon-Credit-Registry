const https = require('https');

const options = {
  hostname: 'webhook.site',
  port: 443,
  path: '/token/b1a4a50a-adea-41a2-bd2d-6691fd6c64c2/requests',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.data && json.data.length > 0) {
        console.log("--- LATEST REQUEST BODY ---");
        console.log(json.data[0].content);
    } else {
        console.log("No requests yet.");
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
