const fs = require('fs');
const path = 'src/app/api/admin/project-management/parties/route.js';
let code = fs.readFileSync(path, 'utf8');

const regex = /const result = await client\.query\(`INSERT INTO pm_parties.*?return NextResponse\.json\(\{success:true,data:result\.rows\[0\]\},\{status:201\}\);/s;

const replacement = `      let result;
      let existingPartyRes;

      if (body.phone && body.phone.trim()) {
        existingPartyRes = await client.query(
          \`SELECT * FROM pm_parties WHERE phone = $1 LIMIT 1\`,
          [body.phone.trim()]
        );
      }

      if (!existingPartyRes || existingPartyRes.rows.length === 0) {
        existingPartyRes = await client.query(
          \`SELECT * FROM pm_parties WHERE name ILIKE $1 LIMIT 1\`,
          [name]
        );
      }

      if (existingPartyRes && existingPartyRes.rows.length > 0) {
        result = existingPartyRes;
      } else {
        result = await client.query(\`INSERT INTO pm_parties(name,phone,email,gst_no,address) VALUES($1,$2,$3,$4,$5) RETURNING *\`, [name, body.phone?.trim() || null, body.email?.trim() || null, body.gst_no?.trim() || null, body.address?.trim() || null]);
        await writePmAudit(client,'party',result.rows[0].id,'created',actorFromAdmin(admin),null,result.rows[0]); 
      }
      
      await client.query('COMMIT');
      return NextResponse.json({success:true,data:result.rows[0]},{status:201});`;

code = code.replace(regex, replacement);
fs.writeFileSync(path, code);
console.log('Fixed party duplicate check.');
