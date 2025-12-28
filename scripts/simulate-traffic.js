/* eslint-disable @typescript-eslint/no-require-imports */
const axios = require('axios');

// Config
const TARGET_HOST = process.env.TARGET_HOST || 'http://localhost:3000';
const CONCURRENT_REQUESTS = 5;
const TOTAL_REQUESTS = 100;
const SLUG = process.argv[2] || 'summer'; // Pass slug as arg or default to 'summer'

console.log(`
╔════════════════════════════════════════════╗
║     XG BOOST - TRAFFIC SIMULATOR v1.0      ║
╚════════════════════════════════════════════╝
  Target: ${TARGET_HOST}/r/${SLUG}
  Volume: ${TOTAL_REQUESTS} Hits
  Mode:   GOD MODE (High Concurrency)
`);

const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', // Mobile
    'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.81 Mobile Safari/537.36', // Mobile
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36', // Desktop
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' // Desktop
];

async function sendHit(i) {
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop';

    try {
        const start = Date.now();
        // Hit the Redirect API directly efficiently
        await axios.get(`${TARGET_HOST}/api/redirect`, {
            params: { slug: SLUG, device: deviceType, intent: 'simulation' },
            headers: { 'User-Agent': userAgent }
        });
        const duration = Date.now() - start;

        process.stdout.write(`\r[${i}/${TOTAL_REQUESTS}] Hit sent! (${duration}ms) - Dev: ${deviceType}   `);
    } catch (e) {
        console.error(`\n[!] Error on hit ${i}: ${e.message}`);
    }
}

async function run() {
    console.log("Injecting Traffic...");
    let active = 0;
    let completed = 0;

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        // Simple throttling for "concurrent-ish" behavior
        if (active >= CONCURRENT_REQUESTS) {
            await new Promise(r => setTimeout(r, 50));
        }
        active++;
        sendHit(i + 1).then(() => {
            active--;
            completed++;
            if (completed === TOTAL_REQUESTS) {
                console.log("\n\n[SUCCESS] Simulation Complete. Check Dashboard Charts.");
            }
        });
    }
}

run();
