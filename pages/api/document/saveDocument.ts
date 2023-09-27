import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { document_type, title, content } = req.body;

      const client = await pool.connect();
      const query = 'INSERT INTO Documents (document_type, title, content) VALUES ($1, $2, $3) RETURNING *';
      const values = [document_type, title, content];
      const result = await client.query(query, values);

      client.release();

      res.status(201).json({ message: 'Document saved successfully', document: result.rows[0] });
    } catch (error) {
      console.error('Error saving document:', error);
      res.status(500).json({ message: 'An error occurred while saving the document' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}