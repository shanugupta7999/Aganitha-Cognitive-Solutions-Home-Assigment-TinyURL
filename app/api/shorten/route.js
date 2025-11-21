import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { generateCode } from "@/lib/generateCode";

export async function POST(req) {
  try {
    console.log("Received shorten request");

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let code;

    for (let i = 0; i < 5; i++) {
      code = generateCode();

      const result = await pool.query(
        "INSERT INTO links(short_code, original_url) VALUES($1, $2) ON CONFLICT DO NOTHING RETURNING *",
        [code, url]
      );

      if (result.rows.length > 0) {
        return NextResponse.json({ shortCode: code }, { status: 201 });
      }
    }

    return NextResponse.json(
      { error: "Failed to generate short code" },
      { status: 500 }
    );
  } catch (err) {
    console.error("Server error:", err.message);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
