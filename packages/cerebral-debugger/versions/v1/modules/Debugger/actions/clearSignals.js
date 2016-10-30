function clearSignals({state, output}) {
  const debuggerState = state.select('debugger');
  const currentSignalIndex = debuggerState.get(['currentSignalIndex']);
  const currentSignal = debuggerState.get(['signals', currentSignalIndex]);
  const clearFromIndex = currentSignal.path[0];
  const rawSignals = debuggerState.get(['signals']);
  const signals = debuggerState.get(['signals']);

  const rawClearedSignals = rawSignals.slice(0, clearFromIndex + 1);
  const clearedSignals = [];

  const currentRememberedSignalPath = [rawClearedSignals.length];
  debuggerState.set(['signals'], rawClearedSignals);
  debuggerState.merge({
    signals: clearedSignals,
    currentSignalIndex: 0,
    currentRememberedSignalPath: currentRememberedSignalPath
  });

  output({
    path: currentRememberedSignalPath
  });
}

export default clearSignals;
