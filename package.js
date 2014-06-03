Package.describe({
  summary: 'Hooks'
});

Package.on_use(function(api) {
  api.use(['collection-hooks', 'underscore', 'minimongo']);
  api.add_files('hooks.js');
  api.export('Hooks');
});

Package.on_test(function(api) {
  api.use(['tinytest', 'hooks'], 'server');
  api.add_files('hooks_tests.js', 'server');
});
