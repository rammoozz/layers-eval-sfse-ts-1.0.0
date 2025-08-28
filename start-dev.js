#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Layers Full Stack Application...\n');

async function runCommand(command, cwd, description) {
  return new Promise((resolve, reject) => {
    console.log(`${description}...`);
    const child = exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${description} failed!`);
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
    
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}

function startServer(command, cwd, name) {
  const child = spawn('npm', ['run', 'dev'], {
    cwd,
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (error) => {
    console.error(`Error starting ${name}:`, error);
  });
  
  return child;
}

async function main() {
  try {
    console.log('Installing dependencies...\n');
    
    // Install backend dependencies
    await runCommand('npm install', './backend', 'Installing backend dependencies');
    
    // Install frontend dependencies  
    await runCommand('npm install', './frontend', 'Installing frontend dependencies');
    
    console.log('\nSetting up backend environment...');
    const envPath = './backend/.env';
    const envExamplePath = './backend/.env.example';
    
    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('Created .env file from .env.example');
    } else if (!fs.existsSync(envExamplePath)) {
      console.log('Warning: .env.example not found!');
    }
    
    console.log('\nStarting development servers...');
    console.log('Backend will start on http://localhost:3001');
    console.log('Frontend will start on http://localhost:5173\n');
    console.log('Press Ctrl+C to stop both servers\n');
    
    // Start backend server
    const backendProcess = startServer('npm run dev', './backend', 'Backend Server');
    
    // Wait a moment for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend server
    const frontendProcess = startServer('npm run dev', './frontend', 'Frontend Server');
    
    console.log('\nBoth servers are starting...\n');
    
    // Handle cleanup on exit
    process.on('SIGINT', () => {
      console.log('\nStopping servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
    
    // Wait for processes
    await Promise.all([
      new Promise(resolve => backendProcess.on('exit', resolve)),
      new Promise(resolve => frontendProcess.on('exit', resolve))
    ]);
    
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

main();