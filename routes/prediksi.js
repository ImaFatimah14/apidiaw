const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/prediksi_diabetes.json');

// Ambil semua data prediksi
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// Tambahkan data prediksi
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newPrediksi = {
    id: Date.now(),
    tanggal_prediksi: new Date().toISOString(),
    ...req.body
  };
  data.push(newPrediksi);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newPrediksi);
});

// Ambil prediksi berdasarkan ID
router.get('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const prediksi = data.find(p => p.id == req.params.id);
  if (prediksi) res.json(prediksi);
  else res.status(404).json({ message: 'Data prediksi tidak ditemukan' });
});

// Update prediksi
router.put('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const index = data.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Data prediksi tidak ditemukan' });
  }
});

// Hapus prediksi
router.delete('/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(filePath));
  const newData = data.filter(p => p.id != req.params.id);
  if (newData.length !== data.length) {
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    res.json({ message: 'Data prediksi berhasil dihapus' });
  } else {
    res.status(404).json({ message: 'Data prediksi tidak ditemukan' });
  }
});

module.exports = router;
