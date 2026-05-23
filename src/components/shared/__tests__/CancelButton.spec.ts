import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { ref } from 'vue';
import { render, screen, fireEvent } from '@testing-library/vue';
import CancelButton from '../CancelButton.vue';

// Mock the useLivenessActor composable using a ref for proper vue reactivity
const mockActorSend = jest.fn();
const actorState = ref({ value: 'recording', done: false, matches: jest.fn() });

jest.mock('../../../composables/useLivenessActor', () => ({
  useLivenessActor: () => [actorState, mockActorSend],
}));

describe('CancelButton', () => {
  const buttonAriaLabel = 'Cancel Liveness check';

  beforeEach(() => {
    actorState.value = { value: 'recording', done: false, matches: jest.fn() };
    mockActorSend.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component content appropriately', () => {
    render(CancelButton, {
      props: { ariaLabel: buttonAriaLabel },
    });

    expect(
      screen.getByRole('button', { name: buttonAriaLabel })
    ).toBeInTheDocument();
  });

  it('should render the close icon', () => {
    render(CancelButton, {
      props: { ariaLabel: buttonAriaLabel },
    });

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should call the send method on cancel', () => {
    render(CancelButton, {
      props: { ariaLabel: buttonAriaLabel },
    });

    const button = screen.getByRole('button', { name: buttonAriaLabel });
    fireEvent.click(button);

    expect(mockActorSend).toHaveBeenCalledWith({
      type: 'CANCEL',
    });
  });

  it('should not render the button if the machine state is done', () => {
    actorState.value = { value: 'done', done: true, matches: jest.fn() };

    render(CancelButton, {
      props: { ariaLabel: buttonAriaLabel },
    });

    expect(
      screen.queryByRole('button', { name: buttonAriaLabel })
    ).not.toBeInTheDocument();
  });
});
