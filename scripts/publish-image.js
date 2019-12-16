const readline = require('readline');
const { spawn } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Which version do you want to publish it as?', async ans => {
    const pathToDockerfile = path.resolve(__dirname, '..');
    const command = spawn(
        `docker build -t marcusthelin/push-notification-server:${ans} -t marcusthelin/push-notification-server:latest ${pathToDockerfile} && docker push marcusthelin/push-notification-server`,
        { shell: true }
    );

    command.stdout.on('data', data => process.stdout.write(data));
    command.on('close', code => {
        console.log(`Docker command exited with code ${code}`);
        process.exit(code);
    });
});
