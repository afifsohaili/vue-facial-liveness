import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LivenessIconWithPopover from '../LivenessIconWithPopover.vue';

describe('LivenessIconWithPopover', () => {
  it('should render the component and show popover on button click', async () => {
    const infoText = 'Test info text';

    render(LivenessIconWithPopover, {
      props: {
        labelText: 'More information about photosensitivity',
        headingText: 'Photosensitivity warning',
      },
      slots: { default: infoText },
    });

    const popoverIcon = screen.queryByTestId('popover-icon');
    expect(popoverIcon).toBeInTheDocument();

    // Click the button using userEvent which triggers Vue reactivity
    const user = userEvent.setup();
    await user.click(popoverIcon!);

    // After click, popover text should appear
    expect(screen.queryByTestId('popover-text')).toBeInTheDocument();
    expect(screen.getByText(infoText)).toBeInTheDocument();
  });
});
