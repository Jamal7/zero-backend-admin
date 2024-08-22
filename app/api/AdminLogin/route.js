// pages/api/login.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { email, password } = req.body;

  const adminEmail = 'zero@gmail.com';
  const adminPassword = '12345678';

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
