const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Simple parser for .env
const envVars = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
        }

        envVars[key] = value;
    }
});

// Overrides
envVars['BETTER_AUTH_URL'] = 'https://Examsphere-lms.vercel.app';

const keys = Object.keys(envVars);

async function addEnv(key, value) {
    const envs = ['production', 'preview', 'development'];

    for (const env of envs) {
        await new Promise((resolve, reject) => {
            // console.log(`Adding ${key} to ${env}...`);
            const cmd = spawn('npx', ['vercel', 'env', 'add', key, env], {
                stdio: ['pipe', 'inherit', 'inherit']
            });

            cmd.stdin.write(value);
            cmd.stdin.end();

            cmd.on('close', (code) => {
                if (code === 0) {
                    console.log(`Successfully added ${key} to ${env}`);
                } else {
                    // console.error(`Failed to add ${key} to ${env}`);
                }
                resolve(); // Continue regardless of error
            });

            cmd.on('error', (err) => {
                console.error(err);
                resolve();
            });
        });
    }
}

async function run() {
    console.log(`Syncing ${keys.length} environment variables to Vercel...`);

    for (const key of keys) {
        if (!envVars[key]) continue;

        console.log(`Processing ${key}...`);

        // Remove existing to avoid errors/prompts
        const envs = ['production', 'preview', 'development'];
        for (const env of envs) {
            const rmArgs = ['vercel', 'env', 'rm', key, env, '-y'];
            const rm = spawn('npx', rmArgs, { stdio: 'ignore' });
            await new Promise(r => rm.on('close', r));
        }

        await addEnv(key, envVars[key]);
    }
    console.log('Environment sync completed.');
}

run();
