// This function allows us to not be concerned with checking for dotted properties
// when reading from the modifier
// e.g. 
//       $set: { 'foo.bar': 'Something' }
// returns:
//       $set: { foo: { bar: 'Something' }}
// 
// We can now check modifications one way, like: update.foo.bar
var resolveModifier = function(modifier) {
  var resolvedProperties = {};
  LocalCollection._modify(resolvedProperties, modifier);

  var newMod = EJSON.clone(modifier);
  newMod.$set = resolvedProperties;
  return newMod;
};

Hooks = {};

var hooks = function(type) {
  return {
    insert: function(collection, options, fn) {
      collection[type].insert(function(userId, doc) {
        if (options.field && ! doc[options.field])
          return;

        fn.apply(this, arguments);
      });
    },
    update: function(collection, options, fn) {
      collection[type].update(function(userId, doc, fieldNames, modifier) {
        if (modifier[options.operator] && ! modifier[options.operator][options.field])
          return;

        this.resolvedModifier = resolveModifier(modifier)[options.operator];

        fn.apply(this, arguments);
      });
    },
    remove: function(collection, options, fn) {
      collection[type].remove(function(userId, doc) {
        if (options.field && ! doc[options.field])
          return;

        fn.apply(this, arguments);
      });
    }
  };
};

Hooks.before = hooks('before');
Hooks.after = hooks('after');