import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import MatchIndicator from '../MatchIndicator.vue';

describe('MatchIndicator', () => {
  it('should render the component and apply appropriate style properties', async () => {
    const testId = 'match';
    const percentage = 35;
    const { container } = render(MatchIndicator, {
      props: { percentage, testId },
    });

    const matchIndicator = screen.getByTestId(testId);
    const matchIndicatorBar = container.getElementsByClassName(
      'amplify-liveness-match-indicator__bar'
    );

    expect(matchIndicator).toBeInTheDocument();
    expect(matchIndicatorBar).toHaveLength(1);
    expect(matchIndicatorBar[0]).toHaveStyle({
      '--percentage': `${percentage}%`,
    });
  });

  it('should not render progress over 100', async () => {
    const testId = 'match';
    const percentage = 120;
    const { container } = render(MatchIndicator, {
      props: { percentage, testId },
    });

    const matchIndicatorBar = container.getElementsByClassName(
      'amplify-liveness-match-indicator__bar'
    );

    expect(matchIndicatorBar[0]).toHaveStyle({
      '--percentage': '100%',
    });
  });

  it('should not render progress less than 0', async () => {
    const testId = 'match';
    const percentage = -20;
    const { container } = render(MatchIndicator, {
      props: { percentage, testId },
    });

    const matchIndicatorBar = container.getElementsByClassName(
      'amplify-liveness-match-indicator__bar'
    );

    expect(matchIndicatorBar[0]).toHaveStyle({
      '--percentage': '0%',
    });
  });
});
