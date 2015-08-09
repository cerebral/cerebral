function setUrl (args, state, next) {
  state.set('url', args.path);
};
export default setUrl;
