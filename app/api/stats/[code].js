import pool from '../../../lib/db';


export default async function handler(req, res) {
const { code } = req.query;
if (!code) return res.status(400).json({ error: 'Missing code' });


try {
const { rows } = await pool.query('SELECT id, original_url, clicks, created_at FROM links WHERE short_code=$1', [code]);
if (!rows.length) return res.status(404).json({ error: 'Not found' });


const link = rows[0];
const logsRes = await pool.query('SELECT user_agent, referer, ip, created_at FROM click_logs WHERE link_id=$1 ORDER BY created_at DESC LIMIT 200', [link.id]);


return res.status(200).json({ link, logs: logsRes.rows });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
}