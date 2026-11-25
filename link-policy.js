'use strict';

// Pure helpers for deciding what the Electron shell may open externally.
// Kept free of Electron imports so they can be unit-tested with plain Node
// (see test/link-policy.test.js).

const EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

// True only for web/mail URLs. Anything else (file:, javascript:, data:,
// protocol-relative or malformed input) must never reach shell.openExternal.
function isExternalUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    return EXTERNAL_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

// True for local file: URLs that point at a PDF (query/hash ignored),
// e.g. the resume.pdf links in index.html.
function isLocalPdfUrl(url) {
  if (typeof url !== 'string') return false;
  const clean = url.toLowerCase().split(/[?#]/)[0];
  return clean.startsWith('file:') && clean.endsWith('.pdf');
}

// electron-builder leaves `asarUnpack`ed files (see build.asarUnpack in
// package.json) in app.asar.unpacked on disk; paths inside app.asar are
// virtual and external apps (e.g. a PDF viewer) cannot open them.
function toUnpackedPath(filePath) {
  return String(filePath).replace(/app\.asar([\\/])/, 'app.asar.unpacked$1');
}

module.exports = { isExternalUrl, isLocalPdfUrl, toUnpackedPath };
