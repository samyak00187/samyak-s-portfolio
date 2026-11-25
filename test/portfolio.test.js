'use strict';

// Static smoke tests for the single-file site. They run with plain Node
// (no browser) and guard the regressions this suite was written for:
// missing component CSS, dead modal code, empty project-link placeholders,
// and element IDs referenced from JS that do not exist in the markup.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const rawHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const html = rawHtml.replace(/data:[^"']+/g, 'DATA'); // shrink base64 blobs
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function extractConfig() {
  const start = rawHtml.indexOf('const CONFIG=');
  assert.notEqual(start, -1, 'CONFIG not found');
  const end = rawHtml.indexOf(';', start);
  // eslint-disable-next-line no-eval -- evaluating our own static literal in a test
  return eval(`(${rawHtml.slice(start + 'const CONFIG='.length, end)})`);
}

test('component CSS exists for previously unstyled elements', () => {
  for (const selector of [
    '#bg{', '#dust{', '.bl', '.gr', '.chip', '.row2', '.btn.o',
    '.acts', '.th img', '.form input', '.form textarea', '#lb{', '#lb.o'
  ]) {
    assert.ok(css.includes(selector), `missing CSS for ${selector}`);
  }
});

test('dead code-modal subsystem is gone', () => {
  assert.ok(!rawHtml.includes('const CODE='), 'CODE array should be removed');
  assert.ok(!rawHtml.includes("id='md'"), 'modal markup should be removed');
  assert.ok(!rawHtml.includes('Copy code'), 'copy-code button should be removed');
});

test('lightbox is a focusable, keyboard-operable dialog', () => {
  assert.ok(html.includes("id='lb' role='dialog'"), 'lightbox needs dialog semantics');
  assert.ok(rawHtml.includes('openLb'), 'lightbox opener missing');
  assert.ok(rawHtml.includes("e.key==='Enter'"), 'thumbnails must open with Enter');
  assert.ok(rawHtml.includes('lb-open'), 'scroll lock class missing');
});

test('skip link focuses the visible main instead of changing the hash', () => {
  assert.ok(rawHtml.includes("querySelector('.skip')"), 'skip handler missing');
  assert.ok(rawHtml.includes("querySelector('main:not([hidden])')"), 'skip handler must target visible main');
});

test('every getElementById target exists in the markup', () => {
  const ids = new Set([...html.matchAll(/ id='([^']+)'/g)].map((m) => m[1]));
  for (const m of rawHtml.matchAll(/getElementById\('([^']+)'\)/g)) {
    assert.ok(ids.has(m[1]), `getElementById('${m[1]}') has no matching element`);
  }
});

test('routes in markup match the page-title map', () => {
  const routes = [...html.matchAll(/<main data-r='([^']+)'/g)].map((m) => m[1]).sort();
  const titlesBlock = rawHtml.slice(rawHtml.indexOf('const T={'), rawHtml.indexOf('};', rawHtml.indexOf('const T={')));
  const titles = [...titlesBlock.matchAll(/(\w+):'/g)].map((m) => m[1]).sort();
  assert.deepEqual(routes, titles);
});

test('project links: no empty placeholders, every entry is an https URL', () => {
  assert.ok(!/:\s*''/.test(rawHtml.slice(rawHtml.indexOf('const CONFIG='), rawHtml.indexOf('const T={'))),
    'CONFIG must not contain empty-string URLs');
  assert.ok(!rawHtml.includes('paste '), 'leftover "paste …" placeholder comment');
  const { projects } = extractConfig();
  for (const [name, links] of Object.entries(projects)) {
    assert.ok(Object.keys(links).length > 0, `${name} has no links`);
    for (const [kind, url] of Object.entries(links)) {
      assert.match(url, /^https:\/\//, `${name}.${kind} is not an https URL: ${url}`);
    }
  }
});

test('every project card either has links or is intentionally linkless', () => {
  // Projects with no public repo / live site / download yet. When one gets a
  // public link, add it to CONFIG in index.html and remove it from this set.
  const intentionallyLinkless = new Set([
    'AI Resume Analyzer',
    '3D Movie Recommender',
    'MYRAA — Personal AI Assistant'
  ]);
  const { projects } = extractConfig();
  const cardKeys = new Set([...html.matchAll(/data-k="([^"]+)"/g)].map((m) => m[1]));
  for (const key of cardKeys) {
    assert.ok(
      projects[key] || intentionallyLinkless.has(key),
      `"${key}" has no CONFIG entry and is not in the linkless allowlist`
    );
  }
  for (const key of Object.keys(projects)) {
    assert.ok(cardKeys.has(key), `CONFIG entry "${key}" matches no project card`);
  }
});

test('This Portfolio links point at the deployed site from the README', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const live = readme.match(/\((https:\/\/samyak00187\.github\.io\/samyak-s-portfolio\/)\)/);
  assert.ok(live, 'live URL not found in README');
  const { projects } = extractConfig();
  assert.equal(projects['This Portfolio'].live, live[1]);
  assert.equal(projects['This Portfolio'].repo, 'https://github.com/samyak00187/samyak-s-portfolio');
});

test('Electron build unpacks resume.pdf and ships the link policy module', () => {
  assert.ok(pkg.build.asarUnpack?.includes('resume.pdf'), 'resume.pdf must be asarUnpack-ed');
  assert.ok(pkg.build.files.includes('link-policy.js'), 'link-policy.js must be in build.files');
  assert.ok(pkg.build.files.includes('resume.pdf'), 'resume.pdf must be in build.files');
  const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  assert.match(main, /sandbox:\s*true/);
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /did-fail-load/);
});

test('bundled assets referenced by the page exist', () => {
  for (const file of ['three.min.js', 'resume.pdf', 'icon.png', 'og.png']) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} missing`);
  }
  assert.ok(html.includes("src='three.min.js'"), 'three.min.js script tag missing');
});
