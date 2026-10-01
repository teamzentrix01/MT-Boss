import fs from 'fs/promises';
import path from 'path';

const apiDir = path.join(process.cwd(), 'src/app/api/admin/project-management');

async function processDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (entry.isFile() && entry.name === 'route.js') {
      let content = await fs.readFile(fullPath, 'utf8');
      
      let changed = false;

      // Ensure import for requirePmAccess
      if (!content.includes('requirePmAccess')) {
        content = content.replace(
          /import {[^}]*requireRole[^}]*} from '@\/lib\/auth';?/g,
          match => match + "\nimport { requirePmAccess } from '@/lib/project-management';"
        );
        // If requireRole is not explicitly imported but requireRole is used:
        if (!content.includes('requirePmAccess') && content.includes('requireRole')) {
           content = content.replace(
             /(import .* from '@\/lib\/project-management';?)/,
             "$1\nimport { requirePmAccess } from '@/lib/project-management';"
           );
        }
      }

      // Replace requireRole(req, 'admin') or requireRole(req, ['admin', 'site_supervisor'])
      if (content.includes('requireRole(req, \'admin\')')) {
        content = content.replace(/requireRole\(req,\s*'admin'\)/g, 'await requirePmAccess(req)');
        changed = true;
      }
      if (content.includes('requireRole(req, [\'admin\', \'site_supervisor\'])')) {
        content = content.replace(/requireRole\(req,\s*\['admin',\s*'site_supervisor'\]\)/g, 'await requirePmAccess(req)');
        changed = true;
      }
      
      if (changed) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir(apiDir).then(() => console.log('Done')).catch(console.error);
