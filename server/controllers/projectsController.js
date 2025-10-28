import Project from '../models/Project.js';

export async function getProjects(req, res) {
  const items = await Project.find();
  res.json(items);
}

export async function getProjectById(req, res) {
  const item = await Project.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Project not found' });
  res.json(item);
}

export async function createProject(req, res) {
  const { title, firstname, lastname, email, completion, description } = req.body;
  const created = await Project.create({ title, firstname, lastname, email, completion, description });
  res.status(201).json(created);
}

export async function updateProject(req, res) {
  const { title, firstname, lastname, email, completion, description } = req.body;
  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    { title, firstname, lastname, email, completion, description },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Project not found' });
  res.json(updated);
}

export async function deleteProject(req, res) {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted', id: req.params.id });
}

export async function deleteAllProjects(req, res) {
  const result = await Project.deleteMany({});
  res.json({ message: 'All projects deleted', deletedCount: result.deletedCount });
}
