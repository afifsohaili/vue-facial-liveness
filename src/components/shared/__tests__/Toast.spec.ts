import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import Toast from '../Toast.vue';

describe('Toast', () => {
  it('should render the component content appropriately', () => {
    render(Toast, {
      slots: { default: 'anything' },
    });

    expect(screen.getByText('anything')).toBeInTheDocument();
  });

  it('can render Toast variations', async () => {
    render(Toast, {
      slots: { default: 'Default' },
      attrs: { 'data-testid': 'defaultToast' },
    });
    render(Toast, {
      props: { variation: 'primary' },
      slots: { default: 'Primary' },
      attrs: { 'data-testid': 'primaryToast' },
    });
    render(Toast, {
      props: { variation: 'error' },
      slots: { default: 'Error' },
      attrs: { 'data-testid': 'errorToast' },
    });

    const defaultToast = screen.getByTestId('defaultToast');
    const primaryToast = screen.getByTestId('primaryToast');
    const errorToast = screen.getByTestId('errorToast');

    expect(defaultToast.classList).toContain('amplify-liveness-toast--default');
    expect(primaryToast.classList).toContain('amplify-liveness-toast--primary');
    expect(errorToast.classList).toContain('amplify-liveness-toast--error');
  });

  it('can render Toast sizes', async () => {
    render(Toast, {
      props: { size: 'medium' },
      slots: { default: 'Medium' },
      attrs: { 'data-testid': 'mediumToast' },
    });
    render(Toast, {
      props: { size: 'large' },
      slots: { default: 'Large' },
      attrs: { 'data-testid': 'largeToast' },
    });

    const mediumToast = screen.getByTestId('mediumToast');
    const largeToast = screen.getByTestId('largeToast');

    expect(mediumToast.classList).toContain('amplify-liveness-toast--medium');
    expect(largeToast.classList).toContain('amplify-liveness-toast--large');
  });
});
