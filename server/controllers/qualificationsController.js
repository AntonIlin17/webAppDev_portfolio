import Qualification from '../models/Qualification.js';

export async function getQualifications(req, res) {
  const items = await Qualification.find();
  res.json(items);
}

export async function getQualificationById(req, res) {
  const item = await Qualification.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Qualification not found' });
  res.json(item);
}

export async function createQualification(req, res) {
  const { title, firstname, lastname, email, completion, description } = req.body;
  const created = await Qualification.create({ title, firstname, lastname, email, completion, description });
  res.status(201).json(created);
}

export async function updateQualification(req, res) {
  const { title, firstname, lastname, email, completion, description } = req.body;
  const updated = await Qualification.findByIdAndUpdate(
    req.params.id,
    { title, firstname, lastname, email, completion, description },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Qualification not found' });
  res.json(updated);
}

export async function deleteQualification(req, res) {
  const deleted = await Qualification.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Qualification not found' });
  res.json({ message: 'Qualification deleted', id: req.params.id });
}

export async function deleteAllQualifications(req, res) {
  const result = await Qualification.deleteMany({});
  res.json({ message: 'All qualifications deleted', deletedCount: result.deletedCount });
}
