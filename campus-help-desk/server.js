const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

function readData() {
  if (!fs.existsSync('requests.json')) return [];
  return JSON.parse(fs.readFileSync('requests.json'));
}
function saveData(data) {
  fs.writeFileSync('requests.json', JSON.stringify(data, null, 2));
}

app.get('/api/requests', (req, res) => {
  res.json(readData());
});

app.get('/api/requests/:id', (req, res) => {
  const item = readData().find(r => r.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

app.post('/api/requests', (req, res) => {
  const data = readData();
  const item = { id: Date.now(), ...req.body };
  data.push(item);
  saveData(data);
  res.status(201).json(item);
});

app.put('/api/requests/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  data[index] = { ...data[index], ...req.body };
  saveData(data);
  res.json(data[index]);
});

app.delete('/api/requests/:id', (req, res) => {
  const data = readData();
  const filtered = data.filter(r => r.id != req.params.id);
  if (filtered.length === data.length) return res.status(404).json({ message: 'Not found' });
  saveData(filtered);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
