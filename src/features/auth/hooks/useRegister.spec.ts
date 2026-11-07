import { renderHook, act } from '@testing-library/react';
import { useRegister } from './useRegister';

jest.mock('../repositories', () => ({
  authRepository: {
    register: jest.fn(),
    fetchViaCEP: jest.fn(),
    checkAvailability: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useRegister Hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should initialize at step 1', () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.success).toBe(false);
  });

  it('should go to next step if validation passes (mocked)', async () => {
    const { result } = renderHook(() => useRegister());

    jest.spyOn(result.current.form, 'trigger').mockResolvedValue(true);

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('should go to prev step', async () => {
    const { result } = renderHook(() => useRegister());
    jest.spyOn(result.current.form, 'trigger').mockResolvedValue(true);

    await act(async () => {
      await result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(1);
  });
});
