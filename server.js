const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get(/^\/(fonts|static)\/.+$/, (req, res) => {
    return handle(req, res)
  });

  server.get('/', (req, res) => {
    return app.render(req, res, '/index');
});

  server.get('/contact', (req, res) => {
      return app.render(req, res, '/contact');
  });

  server.get('/medias', (req, res) => {
      return app.render(req, res, '/medias');
  });

  server.get('/news', (req, res) => {
      return app.render(req, res, '/news');
  });

  server.get('/legale', (req, res) => {
      return app.render(req, res, '/legale');
  });

  server.get('/news/:slug', (req, res) => {
    const {query, params} = req;
    return app.render(req, res, '/news/[slug]', { ...query, ...params });
  });

  server.get('/:type/:slug', (req, res) => {
    const {query, params} = req;
    return app.render(req, res, '/[type]/[slug]', { ...query, ...params });
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(8080, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8080')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
