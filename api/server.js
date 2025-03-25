import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createClient } from 'microcms-js-sdk';


 // .env
dotenv.config();
// Express
const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: '*',
  methods: 'GET',
}));

// MicroCMS
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// get category
app.get('/api/notes', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const queries = {};

    if (category) {
      queries.filters = `category[equals]${category}`;
    }
    if (limit) {
      queries.limit = parseInt(limit, 10);
    }

    const response = await client.get({
      endpoint: 'notes',
      queries,
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (error) {
    // error
    console.error('Error fetching data from MicroCMS:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// get one
app.get('/api/notes/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const response = await client.get({
      endpoint: 'notes',
      contentId: postId,
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);

    // error
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch the blog post' });
    }
  }
});

//versel hosting
export default app;
