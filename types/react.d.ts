import 'react';

declare module 'react' {
  export function useOptimistic<State, UpdateArg>(
    state: State,
    updateFn?: (currentState: State, optimisticValue: UpdateArg) => State
  ): [State, (action: UpdateArg) => void];
}
