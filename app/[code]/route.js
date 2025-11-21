import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { code } = params;

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE short_code=$1",
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.redirect("/", 302);
    }

    const link = result.rows[0];

    await pool.query(
      "UPDATE links SET clicks = clicks + 1 WHERE short_code=$1",
      [code]
    );

    return NextResponse.redirect(link.original_url, 302);
  } catch (err) {
    console.error("Redirect error:", err);
    return NextResponse.redirect("/", 302);
  }
}
