const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { email, password, name, phone } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashed, name, phone } });
  const token = generateToken(user.id);
  res.status(201).json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const token = generateToken(user.id);
  res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
};

exports.getMe = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id:true, email:true, name:true, phone:true, avatar:true, role:true, address:true, createdAt:true } });
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await prisma.user.update({ where: { id: req.user.id }, data: { name, phone, address } });
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, address: user.address } });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
  res.json({ success: true, message: 'Password updated' });
};
