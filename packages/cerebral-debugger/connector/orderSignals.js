function orderSignals(initialSignals) {

  const path = [];

  function findSignals(allSignals, entity, index) {

    path.push(index);

    // Is async chain
    if (Array.isArray(entity)) {
      allSignals = allSignals.concat(entity.reduce(findSignals, []));
    }

    if (entity.branches) {
      const signal = entity;
      path.push('branches');
      allSignals = allSignals.concat(signal).concat((entity.branches || []).reduce(findSignals, []));
      path.pop();
    }

    if (entity.signals) {
      path.push('signals');
      allSignals = allSignals.concat(entity.signals.reduce(findSignals, []));
      path.pop();
    }

    if (entity.outputPath) {
      path.push('outputs');
      path.push(entity.outputPath);
      allSignals = allSignals.concat(entity.outputs[entity.outputPath].reduce(findSignals, []));
      path.pop();
      path.pop();
    }

    path.pop();

    return allSignals;
  }

  return initialSignals.reduce(findSignals, []);
}

export default orderSignals;
