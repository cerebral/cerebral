module.exports = function (controller) {
  return function (modules) {
    Object.keys(modules).forEach(function (moduleName) {
      var module = modules[moduleName];
      Object.keys(module.signals || {}).forEach(function (key) {
        if (Array.isArray(module.signals[key])) {
          var signalName = moduleName + '.' + key;
          controller.signal(signalName, module.signals[key]);
        }
      });
      Object.keys(module.signalsSync || {}).forEach(function (key) {
        if (Array.isArray(module.signalsSync[key])) {
          var signalName = moduleName + '.' + key;
          controller.signalSync(signalName, module.signalsSync[key]);
        }
      });
      controller.modules[moduleName] = {
        signals: signals[moduleName],
        services: module.services
      };
      if (typeof module.init === 'function') {
        var meta = module.init({
          controller,
          name: moduleName,
          signals: signals[moduleName]
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
