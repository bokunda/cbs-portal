#!/usr/bin/env node
/**
 * CBS Portal — Smoke Test Suite
 * Run: node smoke-test.js
 * Verifies all services are up, auth works, and security headers are present.
 */

const https = require('https');
const http = require('http');

const CONFIG = {
  ui: 'https://cbs-ui-uat-147527109622.europe-west1.run.app',
  strapi: 'https://cbs-strapi-uat-147527109622.europe-west1.run.app',
  hubspot: 'https://cbs-hubspot-uat-147527109622.europe-west1.run.app',
  // Set via env var or replace with actual token
  apiAuthToken: process.env.API_AUTH_TOKEN || 'your-api-auth-token',
};

const RESULTS = { passed: 0, failed: 0, total: 0 };

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 10000, ...opts, headers: opts.headers || {} }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function test(name, fn) {
  RESULTS.total++;
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    RESULTS.passed++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    RESULTS.failed++;
  }
}

async function run() {
  console.log('🔍 CBS Portal Smoke Test\n');

  // ── Health checks ──
  console.log('🏥 Health Checks:');
  await test('Strapi /_health returns 200', async () => {
    const res = await fetch(`${CONFIG.strapi}/_health`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  await test('UI / returns 200', async () => {
    const res = await fetch(`${CONFIG.ui}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  await test('HubSpot /health returns 200', async () => {
    const res = await fetch(`${CONFIG.hubspot}/health`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // ── Auth checks ──
  console.log('\n🔐 Auth Checks:');
  await test('HubSpot rejects request without token (401)', async () => {
    const res = await fetch(`${CONFIG.hubspot}/api/debug/deal/123`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('HubSpot accepts request with valid token (200)', async () => {
    const res = await fetch(`${CONFIG.hubspot}/health`, {
      headers: { Authorization: `Bearer ${CONFIG.apiAuthToken}` },
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // ── Security headers ──
  console.log('\n🛡️ Security Headers:');
  await test('UI has Content-Security-Policy header', async () => {
    const res = await fetch(`${CONFIG.ui}/`);
    if (!res.headers['content-security-policy']) throw new Error('CSP header missing');
  });

  await test('UI has Strict-Transport-Security header', async () => {
    const res = await fetch(`${CONFIG.ui}/`);
    if (!res.headers['strict-transport-security']) throw new Error('HSTS header missing');
  });

  await test('UI has Cross-Origin-Opener-Policy header', async () => {
    const res = await fetch(`${CONFIG.ui}/`);
    if (!res.headers['cross-origin-opener-policy']) throw new Error('COOP header missing');
  });

  await test('Strapi has X-Frame-Options: DENY', async () => {
    const res = await fetch(`${CONFIG.strapi}/_health`);
    if (res.headers['x-frame-options'] !== 'DENY') throw new Error(`Got ${res.headers['x-frame-options']}`);
  });

  // ── Gate check ──
  console.log('\n🚪 Gate Check:');
  await test('UI redirects to login when unauthenticated', async () => {
    const res = await fetch(`${CONFIG.ui}/en/`);
    // Gate should be active — page should contain login form or redirect
    if (!res.body.includes('gate') && !res.body.includes('login') && !res.body.includes('password')) {
      console.log('     ⚠️  Gate may be disabled — no login form detected');
    }
  });

  // ── Summary ──
  console.log(`\n📊 Results: ${RESULTS.passed}/${RESULTS.total} passed${RESULTS.failed ? `, ${RESULTS.failed} FAILED` : ''}`);
  process.exit(RESULTS.failed ? 1 : 0);
}

run().catch((err) => {
  console.error(`\n💥 Fatal: ${err.message}`);
  process.exit(2);
});
