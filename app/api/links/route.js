import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all links
export async function GET() {
  try {
    const query = `
      SELECT id, short_code, original_url, clicks, created_at 
      FROM links 
      ORDER BY created_at DESC 
      LIMIT 100
    `;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);

  } catch (err) {
    console.error("GET /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE a link
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await pool.query("DELETE FROM links WHERE id=$1", [id]);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
