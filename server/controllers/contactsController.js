import Contact from '../models/Contact.js';

export async function getContacts(req, res) {
  const items = await Contact.find();
  res.json(items);
}

export async function getContactById(req, res) {
  const item = await Contact.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Contact not found' });
  res.json(item);
}

export async function createContact(req, res) {
  const { firstname, lastname, email, phone, message } = req.body;
  const created = await Contact.create({ firstname, lastname, email, phone, message });
  res.status(201).json(created);
}

export async function updateContact(req, res) {
  const { firstname, lastname, email, phone, message } = req.body;
  const updated = await Contact.findByIdAndUpdate(
    req.params.id,
    { firstname, lastname, email, phone, message },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  res.json(updated);
}

export async function deleteContact(req, res) {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Contact not found' });
  res.json({ message: 'Contact deleted', id: req.params.id });
}

export async function deleteAllContacts(req, res) {
  const result = await Contact.deleteMany({});
  res.json({ message: 'All contacts deleted', deletedCount: result.deletedCount });
}
