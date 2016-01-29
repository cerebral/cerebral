module.exports = function (urlGetters, args) {
  return urlGetters.map(function (urlGetter) {
    return urlGetter.fn(args) || urlGetter.urlPart;
  }).join('');
};
