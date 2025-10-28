import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function getUsers(req, res) {
  const users = await User.find({}, '-password');
  res.json(users);
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function createUser(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const hashed = await bcrypt.hash(password, 10);
  const created = await User.create({ name, email, password: hashed });
  res.status(201).json({ _id: created._id, name: created.name, email: created.email, created: created.created, updated: created.updated });
}

export async function updateUser(req, res) {
  const { name, email, password } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  const saved = await user.save();
  res.json({ _id: saved._id, name: saved.name, email: saved.email, created: saved.created, updated: saved.updated });
}

export async function deleteUser(req, res) {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted', id: req.params.id });
}

export async function deleteAllUsers(req, res) {
  const result = await User.deleteMany({});
  res.json({ message: 'All users deleted', deletedCount: result.deletedCount });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);
  res.json({ _id: user._id, name: user.name, email: user.email, token });
}

export async function logout(req, res) {
  res.clearCookie('jwt', cookieOptions());
  res.json({ message: 'Logged out' });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id, '-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function setAuthCookie(res, token) {
  res.cookie('jwt', token, cookieOptions());
}
