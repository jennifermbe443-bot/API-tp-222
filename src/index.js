// src/index.js
const express = require('express');
const cors    = require('cors');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const articleRoutes = require('./routes/articleRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/articles', articleRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Blog API Docs - INF222'
}));

app.get('/', (req, res) => {
  res.json({
    message:       'Blog API - INF222 EC1 Taf1',
    auteur:        'MAFOGANG MBE JENNIE PRISCA (24G2630)',
    version:       '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      'GET    /api/articles':               'Lister tous les articles',
      'POST   /api/articles':               'Créer un article',
      'GET    /api/articles/search?query=': 'Rechercher des articles',
      'GET    /api/articles/:id':           'Récupérer un article par ID',
      'PUT    /api/articles/:id':           'Modifier un article',
      'DELETE /api/articles/:id':           'Supprimer un article',
    }
  });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route non trouvée.' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne.', error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n✅  Blog API démarrée sur http://localhost:${PORT}`);
  console.log(`📚  Swagger : http://localhost:${PORT}/api-docs\n`);
});

module.exports = app;
