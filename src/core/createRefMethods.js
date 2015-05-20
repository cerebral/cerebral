/*
  Refs are a way for Cerebral to keep track of client side referencing and IDS.
  This is an important concept for doing optimistic updates.
*/
module.exports = function(helpers) {

  return {
    create: function(id) {
      var ref = helpers.refs[helpers.refs.length] = 'cerebral_ref_' + helpers.nextRef++;
      if (arguments.length) {
        if (helpers.ids.indexOf(id) >= 0) {
          return helpers.refs[helpers.ids.indexOf(id)];
        }
        helpers.ids[helpers.ids.length] = id;
      } else {
        helpers.ids[helpers.ids.length] = null;
      }
      return ref;
    },
    update: function(ref, id) {
      if (helpers.ids.indexOf(id) >= 0) {
        throw new Error('Cerebral - The id to reference already exists. Make sure all ids are unique and that you update refs with ids.');
      }
      helpers.ids[helpers.refs.indexOf(ref)] = id;
      return ref;
    },
    get: function(id) {
      return helpers.refs[helpers.ids.indexOf(id)];
    },
    remove: function(idOrRef) {
      if (helpers.refs.indexOf(idOrRef) !== -1) {
        var index = helpers.refs.indexOf(idOrRef);
        helpers.refs.splice(index, 1);
        helpers.ids.splice(index, 1);
      } else if (helpers.ids.indexOf(idOrRef) !== -1) {
        var index = helpers.ids.indexOf(idOrRef);
        helpers.refs.splice(index, 1);
        helpers.ids.splice(index, 1);
      }
    }
  };

};
