'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { isExternalUrl, isLocalPdfUrl, toUnpackedPath } = require('../link-policy');

test('isExternalUrl allows http, https and mailto', () => {
  assert.equal(isExternalUrl('https://github.com/samyak00187'), true);
  assert.equal(isExternalUrl('http://example.com/page?x=1#y'), true);
  assert.equal(isExternalUrl('mailto:samyak86jain@gmail.com'), true);
});

test('isExternalUrl rejects everything else', () => {
  for (const bad of [
    'file:///C:/Users/x/resume.pdf',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    '//protocol-relative.example.com',
    'ftp://example.com/file',
    '',
    'not a url'
  ]) {
    assert.equal(isExternalUrl(bad), false, bad);
  }
  for (const bad of [undefined, null, 42, {}]) {
    assert.equal(isExternalUrl(bad), false, String(bad));
  }
});

test('isLocalPdfUrl matches local PDFs only', () => {
  assert.equal(isLocalPdfUrl('file:///app/resume.pdf'), true);
  assert.equal(isLocalPdfUrl('file:///app/RESUME.PDF'), true);
  assert.equal(isLocalPdfUrl('file:///app/resume.pdf#page=2'), true);
  assert.equal(isLocalPdfUrl('file:///app/index.html'), false);
  assert.equal(isLocalPdfUrl('https://example.com/resume.pdf'), false);
  assert.equal(isLocalPdfUrl(undefined), false);
});

test('toUnpackedPath rewrites packaged asar paths and leaves dev paths alone', () => {
  const packaged = path.join('resources', 'app.asar', 'resume.pdf');
  assert.equal(
    toUnpackedPath(packaged),
    path.join('resources', 'app.asar.unpacked', 'resume.pdf')
  );
  const dev = path.join('home', 'user', 'portfolio', 'resume.pdf');
  assert.equal(toUnpackedPath(dev), dev);
});
