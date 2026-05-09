const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/calendar');

// ── Schema ──────────────────────────────────────────────
const Schedule = mongoose.model('Schedule', new mongoose.Schema({
  title:       String,
  taskDate:    Date,
  isRecurring: Boolean,
  type:        String,   // Day | Week | Month | Year
  cycle:       Number,
  endDate:     Date
}));

// ── Recurrence Logic ────────────────────────────────────
function getOccurrences(s, year, month) {
  const results = [];
  const start   = new Date(s.taskDate);
  const mStart  = new Date(year, month, 1);
  const mEnd    = new Date(year, month + 1, 0);

  if (!s.isRecurring) {
    if (start >= mStart && start <= mEnd)
      results.push(start.getDate());
    return results;
  }

  const end = new Date(s.endDate);
  let cur   = new Date(start);

  while (cur <= end && cur <= mEnd) {
    if (cur >= mStart)
      results.push(cur.getDate());
    cur = nextDate(cur, s.type, s.cycle, start);
  }
  return results;
}

function nextDate(date, type, cycle, origin) {
  const d = new Date(date);
  if (type === 'Day')  { d.setDate(d.getDate() + cycle); return d; }
  if (type === 'Week') { d.setDate(d.getDate() + cycle * 7); return d; }

  // Month / Year — must clamp to last day
  if (type === 'Month') {
    let m = d.getMonth() + cycle;
    let y = d.getFullYear() + Math.floor(m / 12);
    m = m % 12;
    const last = new Date(y, m + 1, 0).getDate();
    d.setFullYear(y); d.setMonth(m);
    d.setDate(Math.min(origin.getDate(), last));
  } else { // Year
    const y    = d.getFullYear() + cycle;
    const last = new Date(y, d.getMonth() + 1, 0).getDate();
    d.setFullYear(y);
    d.setDate(Math.min(origin.getDate(), last));
  }
  return d;
}

// ── Routes ───────────────────────────────────────────────
app.post('/api/schedules', async (req, res) => {
  const s = await Schedule.create(req.body);
  res.json(s);
});

app.get('/api/schedules', async (req, res) => {
  const year  = parseInt(req.query.year);
  const month = parseInt(req.query.month); // 0-indexed
  const all   = await Schedule.find();
  const out   = [];
  for (const s of all) {
    for (const day of getOccurrences(s, year, month))
      out.push({ day, title: s.title, id: s._id });
  }
  res.json(out);
});

app.listen(3000, () => console.log('http://localhost:3000'));