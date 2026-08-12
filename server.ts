import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { POST as chatHandler } from './app/api/chat/route.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Server-side API endpoint for streaming chat
  app.post('/api/chat', async (req, res) => {
    try {
      const protocol = req.protocol || 'http';
      const host = req.headers.host || 'localhost:3000';
      const url = `${protocol}://${host}${req.originalUrl || '/api/chat'}`;

      // Convert Node/Express request into a Web Standard Request
      const webRequest = new Request(url, {
        method: 'POST',
        headers: req.headers as unknown as HeadersInit,
        body: JSON.stringify(req.body),
      });

      const webResponse = await chatHandler(webRequest);

      // Transfer web response headers to Express response
      webResponse.headers.forEach((value, key) => {
        // Skip content-length if chunked streaming
        if (key.toLowerCase() !== 'content-length') {
          res.setHeader(key, value);
        }
      });

      res.status(webResponse.status);

      // Pipe standard ReadableStream body to Express response
      if (webResponse.body) {
        const reader = webResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        res.end();
      }
    } catch (err) {
      console.error('Express /api/chat error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error processing chat stream' });
      }
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
