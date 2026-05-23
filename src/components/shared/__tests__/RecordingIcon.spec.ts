import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import RecordingIcon from '../RecordingIcon.vue';

describe('RecordingIcon', () => {
  it('should render the component content appropriately', () => {
    const indicatorText = 'Rec';

    render(RecordingIcon, {
      slots: { default: indicatorText },
    });

    expect(screen.getByTestId('rec-icon')).toBeInTheDocument();
    expect(screen.getByText(indicatorText)).toBeInTheDocument();
  });
});
