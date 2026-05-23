import { describe, it, expect } from '@jest/globals';

describe('helpers', () => {
  it('should export STATIC_VIDEO_CONSTRAINTS', () => {
    const { STATIC_VIDEO_CONSTRAINTS } = require('../helpers');
    expect(STATIC_VIDEO_CONSTRAINTS).toBeDefined();
    expect(STATIC_VIDEO_CONSTRAINTS.width).toBeDefined();
    expect(STATIC_VIDEO_CONSTRAINTS.height).toBeDefined();
    expect(STATIC_VIDEO_CONSTRAINTS.frameRate).toBeDefined();
    expect(STATIC_VIDEO_CONSTRAINTS.facingMode).toBe('user');
  });

  it('should have correct min width/height', () => {
    const { STATIC_VIDEO_CONSTRAINTS } = require('../helpers');
    const width = STATIC_VIDEO_CONSTRAINTS.width as ConstrainULongRange;
    const height = STATIC_VIDEO_CONSTRAINTS.height as ConstrainULongRange;
    expect(width.min).toBe(320);
    expect(height.min).toBe(240);
  });
});
