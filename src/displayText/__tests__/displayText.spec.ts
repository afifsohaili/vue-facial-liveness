import { describe, it, expect } from '@jest/globals';

describe('getDisplayText', () => {
  it('should return display texts with custom values', () => {
    const { getDisplayText } = require('../getDisplayText');
    const customDisplayText = {
      hintTooCloseText: 'Way too close!',
      cancelLivenessCheckText: 'Cancel verification process',
      startScreenBeginCheckText: 'Verification process',
      cameraNotFoundHeadingText: 'Camera was not found',
      photosensitivyWarningHeadingText: 'Photosensitive Warning',
      photosensitivityWarningInfoText: 'This is some info',
    };

    const {
      streamDisplayText,
      cameraDisplayText,
      hintDisplayText,
      instructionDisplayText,
    } = getDisplayText(customDisplayText);

    expect(hintDisplayText.hintTooCloseText).toBe(
      customDisplayText.hintTooCloseText
    );
    expect(streamDisplayText.cancelLivenessCheckText).toBe(
      customDisplayText.cancelLivenessCheckText
    );
    expect(instructionDisplayText.startScreenBeginCheckText).toBe(
      customDisplayText.startScreenBeginCheckText
    );
    expect(cameraDisplayText.cameraNotFoundHeadingText).toBe(
      customDisplayText.cameraNotFoundHeadingText
    );
    expect(instructionDisplayText.photosensitivityWarningHeadingText).toBe(
      customDisplayText.photosensitivyWarningHeadingText
    );
    expect(instructionDisplayText.photosensitivityWarningInfoText).toBe(
      customDisplayText.photosensitivityWarningInfoText
    );
  });
});

describe('displayText', () => {
  it('should export defaultLivenessDisplayText', () => {
    const { defaultLivenessDisplayText } = require('../displayText');
    expect(defaultLivenessDisplayText).toBeDefined();
    expect(defaultLivenessDisplayText.hintCenterFaceText).toBe(
      'Center your face'
    );
    expect(defaultLivenessDisplayText.startScreenBeginCheckText).toBe(
      'Start video check'
    );
  });

  it('should export defaultErrorDisplayText', () => {
    const { defaultErrorDisplayText } = require('../displayText');
    expect(defaultErrorDisplayText).toBeDefined();
    expect(defaultErrorDisplayText.tryAgainText).toBe('Try again');
  });

  it('should return default display text when no override provided', () => {
    const { getDisplayText } = require('../getDisplayText');
    const result = getDisplayText(undefined);
    expect(result.hintDisplayText).toBeDefined();
    expect(result.cameraDisplayText).toBeDefined();
    expect(result.instructionDisplayText).toBeDefined();
    expect(result.streamDisplayText).toBeDefined();
    expect(result.errorDisplayText).toBeDefined();
    expect(result.hintDisplayText.hintCenterFaceText).toBe('Center your face');
  });

  it('should merge override display text with defaults', () => {
    const { getDisplayText } = require('../getDisplayText');
    const result = getDisplayText({
      hintCenterFaceText: 'Custom center text',
    });
    expect(result.hintDisplayText.hintCenterFaceText).toBe(
      'Custom center text'
    );
    expect(result.hintDisplayText.hintTooFarText).toBe('Move closer');
  });
});
