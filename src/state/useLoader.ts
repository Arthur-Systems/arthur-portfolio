'use client';

import { useLoaderContextInternal } from './LoaderContext';
export { Loader } from './loaderBus';

export function useLoader() {
  return useLoaderContextInternal();
}


