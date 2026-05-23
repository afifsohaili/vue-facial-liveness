import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/vue';
import FaceLivenessErrorModal from '../FaceLivenessErrorModal.vue';
import { defaultErrorDisplayText } from '../../../displayText';

const { serverHeaderText, serverMessageText, tryAgainText } =
  defaultErrorDisplayText;

describe('FaceLivenessErrorModal', () => {
  it('should render the component with slot content', () => {
    render(FaceLivenessErrorModal, {
      props: { onRetry: () => {} },
      slots: {
        default: `<div>${serverHeaderText}</div><div>${serverMessageText}</div>`,
      },
    });

    expect(screen.getByText(serverHeaderText)).toBeInTheDocument();
    expect(screen.getByText(serverMessageText)).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(FaceLivenessErrorModal, {
      props: { onRetry },
      slots: {
        default: `<div>Error content</div>`,
      },
    });

    const retryButton = screen.getByText(tryAgainText);
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render with proper accessibility attributes', () => {
    render(FaceLivenessErrorModal, {
      props: { onRetry: () => {} },
      slots: {
        default: `<div>Error content</div>`,
      },
    });

    const timeoutModal = screen.getByRole('alertdialog');
    expect(timeoutModal).toBeInTheDocument();
    expect(timeoutModal).toHaveAttribute(
      'aria-describedby',
      'amplify-liveness-error-message'
    );
    expect(timeoutModal).toHaveAttribute(
      'aria-labelledby',
      'amplify-liveness-error-heading'
    );
  });
});
