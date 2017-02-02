/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const CacheStartUrlAudit = require('../../audits/cache-start-url.js');
const assert = require('assert');
const manifestSrc = JSON.stringify(require('../fixtures/manifest.json'));
const manifestParser = require('../../lib/manifest-parser');
const CacheContents = ['https://another.example.com/', 'https://example.com/'];
const URL = 'https://example.com';
const AltURL = 'https://example.com/?utm_source=http203';
const exampleManifest = manifestParser(manifestSrc, URL, URL);

/* eslint-env mocha */

describe('Cache: start_url audit', () => {
  it('fails with no debugString if page had no manifest', () => {
    const result = CacheStartUrlAudit.audit({
      Manifest: null,
      CacheContents,
      URL: {finalUrl: URL}
    });
    assert.strictEqual(result.rawValue, false);
    assert.strictEqual(result.debugString, undefined);
  });

  it('succeeds when given a manifest with a start_url, cache contents, and a URL', () => {
    return assert.equal(CacheStartUrlAudit.audit({
      Manifest: exampleManifest,
      CacheContents,
      URL: {finalUrl: URL}
    }).rawValue, true);
  });

  it('handles URLs with utm params', () => {
    return assert.equal(CacheStartUrlAudit.audit({
      Manifest: exampleManifest,
      CacheContents,
      URL: {finalUrl: AltURL}
    }).rawValue, true);
  });
});
