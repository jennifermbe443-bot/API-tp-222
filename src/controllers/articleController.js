// src/controllers/articleController.js
const { validationResult } = require('express-validator');
const ArticleModel = require('../models/articleModel');

exports.createArticle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const article = ArticleModel.create(req.body);
    res.status(201).json({ success: true, message: 'Article créé avec succès.', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};

exports.getAllArticles = (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = ArticleModel.findAll({ categorie, auteur, date });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};

exports.searchArticles = (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '')
    return res.status(400).json({ success: false, message: 'Le paramètre "query" est requis.' });
  try {
    const articles = ArticleModel.search(query.trim());
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};

exports.getArticleById = (req, res) => {
  try {
    const article = ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé.' });
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};

exports.updateArticle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const article = ArticleModel.update(req.params.id, req.body);
    if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé.' });
    res.status(200).json({ success: true, message: 'Article mis à jour.', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};

exports.deleteArticle = (req, res) => {
  try {
    const deleted = ArticleModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Article non trouvé.' });
    res.status(200).json({ success: true, message: 'Article supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};
