import { describe, it, expect } from '@jest/globals';
import { VERSION } from '../../version';

describe('getLivenessUserAgent', () => {
  it('should return a user agent string containing the current version', () => {
    const { getLivenessUserAgent } = require('../platform');
    const customUserAgent = getLivenessUserAgent();

    expect(customUserAgent).toContain('vue-facial-liveness');
    expect(customUserAgent).toContain(VERSION);
  });
});
