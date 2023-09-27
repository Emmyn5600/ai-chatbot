import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM Documents'; 
      const result = await client.query(query);

      client.release();

      res.status(200).json({ documents: result.rows });
    } catch (error) {
      console.error('Error retrieving documents:', error);
      res.status(500).json({ message: 'An error occurred while retrieving documents' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
