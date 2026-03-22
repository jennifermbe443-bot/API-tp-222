// src/models/articleModel.js
const { readDB, writeDB } = require('../config/database');

class ArticleModel {

  // Créer un article
  static create({ titre, contenu, auteur, date, categorie, tags }) {
    const db = readDB();
    const article = {
      id:        db.nextId++,
      titre,
      contenu,
      auteur,
      date:      date || new Date().toISOString().split('T')[0],
      categorie: categorie || 'General',
      tags:      Array.isArray(tags) ? tags : []
    };
    db.articles.unshift(article);
    writeDB(db);
    return article;
  }

  // Lister tous les articles avec filtres optionnels
  static findAll({ categorie, auteur, date } = {}) {
    let { articles } = readDB();
    if (categorie) articles = articles.filter(a => a.categorie.toLowerCase() === categorie.toLowerCase());
    if (auteur)    articles = articles.filter(a => a.auteur.toLowerCase()    === auteur.toLowerCase());
    if (date)      articles = articles.filter(a => a.date === date);
    return articles;
  }

  // Récupérer un article par ID
  static findById(id) {
    const { articles } = readDB();
    return articles.find(a => a.id === parseInt(id)) || null;
  }

  // Mettre à jour un article
  static update(id, { titre, contenu, categorie, tags }) {
    const db = readDB();
    const idx = db.articles.findIndex(a => a.id === parseInt(id));
    if (idx === -1) return null;

    const article = db.articles[idx];
    if (titre     !== undefined) article.titre     = titre;
    if (contenu   !== undefined) article.contenu   = contenu;
    if (categorie !== undefined) article.categorie = categorie;
    if (tags      !== undefined) article.tags      = Array.isArray(tags) ? tags : [];

    db.articles[idx] = article;
    writeDB(db);
    return article;
  }

  // Supprimer un article
  static delete(id) {
    const db = readDB();
    const idx = db.articles.findIndex(a => a.id === parseInt(id));
    if (idx === -1) return false;
    db.articles.splice(idx, 1);
    writeDB(db);
    return true;
  }

  // Rechercher par titre ou contenu
  static search(query) {
    const { articles } = readDB();
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.titre.toLowerCase().includes(q) ||
      a.contenu.toLowerCase().includes(q)
    );
  }
}

module.exports = ArticleModel;
