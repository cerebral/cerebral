module.exports = function (controller) {
  return function (modules) {
    Object.keys(modules).forEach(function (moduleName) {
      var module = modules[moduleName];
      var signals = Object.keys(module.signals || {}).reduce(function (signals, key) {
        if (Array.isArray(module.signals[key])) {
          var signalName = moduleName + '.' + key;
          signals[key] = controller.signal(signalName, module.signals[key]);
        }
        return signals;
      }, {});
      signals = Object.keys(module.signalsSync || {}).reduce(function (signals, key) {
        if (Array.isArray(module.signalsSync[key])) {
          var signalName = moduleName + '.' + key;
          signals[key] = controller.signalSync(signalName, module.signalsSync[key]);
        }
        return signals;
      }, signals);
      controller.modules[moduleName] = {
        name: moduleName,
        signals: signals,
        services: module.services
      };
      if (typeof module.init === 'function') {
        var meta = module.init({
          controller: controller,
          name: moduleName,
          signals: signals
        });
        if (typeof meta === 'object') {
          Object.keys(meta).forEach(function (key) {
            controller.modules[moduleName][key] = meta[key];
          });
        }
      }
      controller.services[moduleName] = controller.modules[moduleName].services;
    });
    return controller.modules;
  };
};
