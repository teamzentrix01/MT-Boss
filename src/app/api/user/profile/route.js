// ============================================
// File: app/api/user/profile/route.js
// ============================================
 
// For the same file, add this to handle PUT:
 
export async function PUT(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    const { name, phone } = await req.json();
 
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, phone = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, name, phone, role, created_at`,
      [name || null, phone || null, decoded.id]
    );
 
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
 
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}