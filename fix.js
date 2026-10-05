const fs = require('fs');
const file = 'src/app/api/admin/project-management/projects/[id]/route.js';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/export async function GET\(req, \{ params \}?\) \{\r?\n  const admin = await requirePmAccess\(req\);\r?\n  if \(!admin\) return unauthorized\(\);\r?\n  try \{\r?\n    await ensureProjectManagementPhase5Schema\(\);\r?\n    const id = Number\(\(await params\)\.id\);/g, 
`export async function GET(req, { params }) {
  const paramId = (await params).id;
  const admin = await requirePmAccess(req, paramId);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const id = Number(paramId);`);

c = c.replace(/export async function PATCH\(req, \{ params \}?\) \{\r?\n  const admin = await requirePmAccess\(req\);\r?\n  if \(!admin\) return unauthorized\(\);\r?\n  try \{\r?\n    await ensureProjectManagementPhase5Schema\(\);\r?\n    const id = Number\(\(await params\)\.id\);/g,
`export async function PATCH(req, { params }) {
  const paramId = (await params).id;
  const admin = await requirePmAccess(req, paramId);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const id = Number(paramId);`);

c = c.replace(/export async function DELETE\(req, \{ params \}?\) \{\r?\n  const admin = await requirePmAccess\(req\);\r?\n  if \(!admin\) return unauthorized\(\);\r?\n  try \{\r?\n    await ensureProjectManagementPhase5Schema\(\);\r?\n    const id = Number\(\(await params\)\.id\);/g,
`export async function DELETE(req, { params }) {
  const paramId = (await params).id;
  const admin = await requirePmAccess(req, paramId);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const id = Number(paramId);`);

fs.writeFileSync(file, c);
