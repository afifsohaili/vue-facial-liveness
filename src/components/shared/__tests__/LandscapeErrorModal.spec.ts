import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/vue';
import LandscapeErrorModal from '../LandscapeErrorModal.vue';

describe('LandscapeErrorModal', () => {
  it('should render the component with header and messages', () => {
    render(LandscapeErrorModal, {
      props: {
        onRetry: () => {},
        header: 'Landscape Mode Detected',
        portraitMessage: 'Please rotate your device to portrait mode',
        landscapeMessage: 'Please rotate your device to portrait mode',
        tryAgainText: 'Try again',
      },
    });

    expect(screen.getByText('Landscape Mode Detected')).toBeInTheDocument();
    expect(
      screen.getByText('Please rotate your device to portrait mode')
    ).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn();
    render(LandscapeErrorModal, {
      props: {
        onRetry,
        header: 'Test',
        portraitMessage: 'Portrait msg',
        landscapeMessage: 'Landscape msg',
        tryAgainText: 'Try again',
      },
    });

    const retryButton = await screen.findByText('Try again');
    expect(retryButton).toBeInTheDocument();
    await fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
