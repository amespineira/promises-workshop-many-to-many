var Promise = require('bluebird');
var knex = require('../db/knex');

function Authors() {
  return knex('authors');
}

function Books(){
  return knex('books');
}

function Authors_Books() {
  return knex('authors_books');
}

function prepIds(ids) {
  return ids.filter(function (id) {
    return id !== '';
  })
}

function insertIntoAuthorsBooks(bookIds, authorId) {
  bookIds = prepIds(bookIds);
  return Promise.all(bookIds.map(function (book_id) {
    book_id = Number(book_id)
    return Authors_Books().insert({
      book_id: book_id,
      author_id: authorId
    })
  }))
}

function getAuthorBooks(author) {
  return Authors_Books().where({'author_id': author.id}).join('books', "authors_books.book_id", "=", "books.id").then(function(result){
      return {author:author, books:result}
    })

}

function getBookAuthors(book) {
  return Authors_Books().where({'book_id': book.id}).join('authors', "authors_books.author_id", "=", "authors.id").then(function(result){
      return {book:book, authors:result}
    })
}


module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors
}
