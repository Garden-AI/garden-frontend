import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GlobusAuthProvider } from './GlobusAuthProvider';
import { useGlobusAuth } from '@globus/react-auth-context';

// Mock the Globus auth hook
vi.mock('@globus/react-auth-context', () => ({
  useGlobusAuth: vi.fn(),
  Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn())
}));

describe('GlobusAuthProvider', () => {
  const mockAuth = {
    authorization: {
      refresh: vi.fn(),
      user: { sub: 'test-user' }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGlobusAuth as any).mockReturnValue(mockAuth);
  });

  it('should check tokens on mount', async () => {
    const mockToken = {
      access_token: 'test-token',
      expires_at: Math.floor(Date.now() / 1000) + 60 // Expires in 1 minute
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

    render(
      <GlobusAuthProvider
        client="test-client"
        redirect="test-redirect"
        scopes="test-scopes"
        storage={localStorage}
      >
        <div>Test Content</div>
      </GlobusAuthProvider>
    );

    // Wait for the initial check
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockAuth.authorization.refresh).toHaveBeenCalled();
  });

  it('should handle token refresh failure', async () => {
    const mockToken = {
      access_token: 'test-token',
      expires_at: Math.floor(Date.now() / 1000) + 60
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));
    mockAuth.authorization.refresh.mockRejectedValue(new Error('Refresh failed'));

    render(
      <GlobusAuthProvider
        client="test-client"
        redirect="test-redirect"
        scopes="test-scopes"
        storage={localStorage}
      >
        <div>Test Content</div>
      </GlobusAuthProvider>
    );

    // Wait for the initial check
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalled();
  });

  it('should not refresh token if not close to expiration', async () => {
    const mockToken = {
      access_token: 'test-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

    render(
      <GlobusAuthProvider
        client="test-client"
        redirect="test-redirect"
        scopes="test-scopes"
        storage={localStorage}
      >
        <div>Test Content</div>
      </GlobusAuthProvider>
    );

    // Wait for the initial check
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockAuth.authorization.refresh).not.toHaveBeenCalled();
  });

  it('should use custom refresh threshold and check interval', async () => {
    const mockToken = {
      access_token: 'test-token',
      expires_at: Math.floor(Date.now() / 1000) + 60
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

    vi.useFakeTimers();

    render(
      <GlobusAuthProvider
        client="test-client"
        redirect="test-redirect"
        scopes="test-scopes"
        storage={localStorage}
        refreshThresholdMinutes={10}
        checkIntervalMinutes={2}
      >
        <div>Test Content</div>
      </GlobusAuthProvider>
    );

    // Initial check
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Advance time by 2 minutes
    await act(async () => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    expect(mockAuth.authorization.refresh).toHaveBeenCalled();

    vi.useRealTimers();
  });
}); 