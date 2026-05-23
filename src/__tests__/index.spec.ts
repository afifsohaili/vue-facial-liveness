import * as livenessExports from '..';

describe('exports', () => {
  it('should export FaceLivenessDetector and FaceLivenessDetectorCore', () => {
    expect(livenessExports.FaceLivenessDetector).toBeDefined();
    expect(livenessExports.FaceLivenessDetectorCore).toBeDefined();
  });

  it('should export expected named exports', () => {
    const sortedExports = Object.keys(livenessExports).sort();

    expect(sortedExports).toMatchSnapshot();
  });
});
