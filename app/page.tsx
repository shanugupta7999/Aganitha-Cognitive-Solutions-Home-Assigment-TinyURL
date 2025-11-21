"use client";

import React, { useState, useEffect } from "react";
import { CopyOutlined, DeleteOutlined, RightOutlined } from "@ant-design/icons";

export default function Home() {
  type Link = {
    id: string | number;
    original_url: string;
    short_code: string;
    clicks: number;
    created_at?: string;
  };

  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("newest");
  const [clickFilter, setClickFilter] = useState("none");

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data: Link[] = await res.json();

    const sorted = data.map((l) => ({
      ...l,
      created_at: l.created_at || new Date().toISOString(),
    }));

    setLinks(sorted);
    setFilteredLinks(sorted);
  }

  useEffect(() => {
    let data = [...links];

    if (search.trim()) {
      data = data.filter((l) =>
        l.original_url.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateFilter === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );
    } else {
      data.sort(
        (a, b) =>
          new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
      );
    }

    if (clickFilter === "high") {
      data.sort((a, b) => b.clicks - a.clicks);
    } else if (clickFilter === "low") {
      data.sort((a, b) => a.clicks - b.clicks);
    }

    setFilteredLinks(data);
  }, [search, dateFilter, clickFilter, links]);

  async function handleShorten(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (data.shortCode) {
      setUrl("");
      fetchLinks();
    } else {
      alert(data.error || "Error");
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Delete this link?")) return;

    await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchLinks();
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-black">Shorten a URL</h1>

        {/* URL FORM */}
        <form
          onSubmit={handleShorten}
          className="flex flex-col sm:flex-row gap-2 mb-4"
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 border p-2 rounded text-black"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto">
            Shorten
          </button>
        </form>

        {/* FILTERS */}
        <div className="mt-2 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold text-black mb-2">Filters</h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by URL..."
            className="w-full border p-2 mb-3 rounded text-black"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border p-2 rounded text-black flex-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <select
              value={clickFilter}
              onChange={(e) => setClickFilter(e.target.value)}
              className="border p-2 rounded text-black flex-1"
            >
              <option value="none">Click Filter</option>
              <option value="high">High → Low</option>
              <option value="low">Low → High</option>
            </select>
          </div>
        </div>

        {/* LINKS LIST */}
        <div className="mt-6 space-y-4">
          {filteredLinks.map((l) => (
            <div
              key={l.id}
              className="flex flex-col sm:flex-row sm:justify-between border-b py-2"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-lg text-blue-600">
                  <a
                    href={`${baseUrl}/${l.short_code}`}
                    target="_blank"
                    className="underline break-words"
                  >
                    {baseUrl}/{l.short_code}
                  </a>

                  <CopyOutlined
                    className="cursor-pointer text-gray-600 hover:bg-gray-200 p-1 rounded"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${baseUrl}/${l.short_code}`
                      );
                      setCopied(l.short_code);
                      setTimeout(() => setCopied(null), 2000);
                    }}
                  />

                  {copied === l.short_code && (
                    <span className="text-green-500 text-sm">Copied!</span>
                  )}
                </div>
                
                <div className="flex flex-row items-center gap-2">
                  <RightOutlined className="text-black bg-black rounded-2xl" />
                  <div className="text-black break-all  overflow-x-auto">
  {l.original_url}
</div>
                </div>
                
                <div className="flex flex-row items-center gap-4">
                  <div className="text-sm text-black bg-gray-200 p-0 rounded-b-lg">{l.clicks} clicks</div>
                  <div className="text-xs text-gray-500">
                  Created At: {new Date(l.created_at!).toLocaleString()}
                </div>
                </div>
                
                
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                

                <button
                  onClick={() => handleDelete(l.id)}
                  className="px-2 py-1 border rounded bg-red-400 text-white flex items-center gap-1"
                >
                  <DeleteOutlined />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
