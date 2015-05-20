var Ref = require('./../src/core/createRefMethods.js');

exports['should be able to create a new ref'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRef = ref.create();
  test.equal(newRef, 0);
  test.done();
};

exports['should add a null value to id if no id passed'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRef = ref.create();
  test.equal(ref.get(newRef), null);
  test.done();
};

exports['should add id if passed'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRef = ref.create('123');
  test.equal(ref.get('123'), newRef);
  test.done();
};

exports['should be able to update a ref with an id'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRef = ref.create();
  ref.update(newRef, '456');
  test.equal(ref.get('456'), newRef);
  test.done();
};

exports['should be able to remove a ref without affecting existing'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRefA = ref.create('123');
  var newRefB = ref.create('456');
  ref.remove('123');
  test.equal(ref.get('456'), newRefB);
  test.done();
};

exports['should throw error when ID already exists'] = function(test) {
  var ref = Ref({
    nextRef: 0,
    refs: [],
    ids: []
  });
  var newRef = ref.create('123');
  test.throws(function() {
    ref.create('123');
  });
  test.throws(function() {
    ref.update(0, '123');
  });
  test.done();
};
