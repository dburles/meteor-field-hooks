Tinytest.add('Before Insert - With options.field and modify doc', function(test) {
  Books = new Meteor.Collection('books' + test.id);
  Authors = new Meteor.Collection('authors' + test.id);

  var author1 = Authors.insert({
    firstName: 'Charles',
    lastName: 'Darwin'
  });

  Hooks.before.insert(Books, { field: 'cat' }, function(userId, doc) {
    doc.foo = 'bar';
  });

  var book1 = Books.insert({
    authorId: author1,
    name: 'On the Origin of Species',
    cat: 'horse'
  });

  var book = Books.findOne(book1);
  test.equal(book.foo, 'bar');
});

Tinytest.add('Before Insert - Without options.field and modify doc', function(test) {
  Books = new Meteor.Collection('books' + test.id);
  Authors = new Meteor.Collection('authors' + test.id);

  var author1 = Authors.insert({
    firstName: 'Charles',
    lastName: 'Darwin'
  });

  Hooks.before.insert(Books, {}, function(userId, doc) {
    doc.foo = 'bar';
  });

  var book1 = Books.insert({
    authorId: author1,
    name: 'On the Origin of Species',
    cat: 'horse'
  });

  var book = Books.findOne(book1);
  test.equal(book.foo, 'bar');
});

Tinytest.add('Before Update - Set with options.field, updating with and without field', function(test) {
  Books = new Meteor.Collection('books' + test.id);
  Authors = new Meteor.Collection('authors' + test.id);

  var author1 = Authors.insert({
    firstName: 'Charles',
    lastName: 'Darwin'
  });

  Hooks.before.update(Books, {
    operator: '$set',
    field: 'name',
  }, function(userId, doc, fieldNames, modifier, options) {
    modifier.$set.rating = 5;
  });

  var book1 = Books.insert({
    authorId: author1,
    name: 'On the Origin of Species',
    rating: 1
  });

  Books.update(book1, {
    $set: {
      name: 'Test',
      'dotted.test': 'stuff'
    }
  });

  book = Books.findOne(book1);

  test.equal(book.rating, 5);

  Books.update(book1, {
    $set: {
      dummy: true,
      rating: 1
    }
  });

  book = Books.findOne(book1);

  test.equal(book.dummy, true);
  test.equal(book.rating, 1);
});

// TODO: More tests