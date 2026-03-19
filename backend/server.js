const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// IN-MEMORY TEMPORARY DATABASE
let issues = [
  {
    id: "1",
    title: "bench desk broken",
    category: "Furniture",
    priority: "Normal",
    status: "Pending",
    locationDesc: "Block B, 1st Floor, 5",
    reporterName: "Student 2918",
    createdAt: "2026-02-23T18:07:00.000Z",
    daysPending: 16,
    affectedCount: 1,
    beforeImage: "https://via.placeholder.com/300x200.png?text=Before",
    afterImage: null,
    adminRemarks: ""
  },
  {
    id: "2",
    title: "Projector not working",
    category: "IT",
    priority: "Critical",
    status: "In Progress",
    locationDesc: "Room 101",
    reporterName: "Student 1021",
    createdAt: "2026-03-18T10:00:00.000Z",
    daysPending: 0,
    affectedCount: 30,
    beforeImage: "https://via.placeholder.com/300x200.png?text=Broken",
    afterImage: null,
    adminRemarks: "Checking cables today."
  }
];

// --- ROUTES ---

app.get('/api/admin/issues', (req, res) => {
  res.json(issues);
});

app.get('/api/issues/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  res.json(issue);
});

app.get('/api/student/issues/:id', (req, res) => {
  const myIssues = issues.filter(i => i.reporterName.includes(req.params.id) || true);
  res.json(myIssues);
});

app.put('/api/admin/issues/:id', (req, res) => {
  const { status, remarks } = req.body;
  const index = issues.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    issues[index].status = status;
    issues[index].adminRemarks = remarks;
  }
  res.json({ success: true });
});

app.post('/api/issues', (req, res) => {
  const body = req.body;
  const newIssue = { 
    id: Date.now().toString(),
    title: body.problemType || "Reported Issue",
    category: body.problemType || "Other",
    priority: "Normal",
    status: 'Pending',
    locationDesc: `${body.building || 'Unknown'}, Floor ${body.floor || '-'}, Room ${body.room || '-'}`,
    reporterName: body.isAnonymous ? "Anonymous" : "Student 2918",
    createdAt: new Date().toISOString(),
    daysPending: 0,
    affectedCount: 1,
    beforeImage: null,
    afterImage: null,
    adminRemarks: ""
  };
  issues.unshift(newIssue); // Add to the top of the array
  res.json({ success: true, id: newIssue.id });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'mock-token', user: { role: 'student', id: '2918' } });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, user: { id: '2918' } });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Temporary backend running at http://localhost:${PORT}`);
  console.log('You can now test the app! When finished, just delete this folder.');
});
