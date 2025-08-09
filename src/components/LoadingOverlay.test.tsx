import { describe, it, expect } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import LoadingOverlay from './LoadingOverlay';
import { LoaderProvider } from '@/state/LoaderContext';
import { Loader } from '@/state/loaderBus';

describe('LoadingOverlay', () => {
  it('shows during file read and hides after panes ready', async () => {
    render(
      <LoaderProvider>
        <LoadingOverlay />
      </LoaderProvider>
    );

    act(() => {
      Loader.start('Reading file…');
    });

    // Synchronous: overlay should be immediately visible after start
    expect(screen.getByRole('dialog', { name: /Application loading/i })).toBeTruthy();

    act(() => {
      Loader.step(80, 'Calibrating ranges…');
    });

    act(() => {
      Loader.finish();
    });

    // After finish + fade, overlay should unmount
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /Application loading/i })).toBeNull(),
      { timeout: 2000 }
    );
  });
});


