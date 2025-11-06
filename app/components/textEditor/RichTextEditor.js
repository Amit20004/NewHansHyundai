'use client';
import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic"; // ✅ dynamic import
import axios from "axios";

// Dynamically import JoditEditor only on client-side
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const PageEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  // Load existing content when slug changes
  useEffect(() => {
    if (!slug) return;
    axios
      .get(`http://localhost:8000/api/get-content/${slug}`)
      .then((res) => {
        setContent(res.data.content || "");
      })
      .catch((err) => {
        console.error(err);
        setContent("");
      });
  }, [slug]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  const saveContent = () => {
    if (!slug || !content) {
      alert("Please enter both slug and content.");
      return;
    }

    axios
      .post("http://localhost:8000/api/save-content", { slug, content })
      .then((res) => {
        alert(res.data.message);
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="absolute top-20 p-5">
      {/* Slug input field */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Slug:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter slug (e.g. policy)"
            style={{ marginLeft: "10px", padding: "5px", width: "200px", border:"1px solid" }}
          />
        </label>
      </div>

      {/* Jodit editor */}
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => setContent(newContent)}
      />

      <button onClick={saveContent} style={{ marginTop: "10px", padding: "5px 15px" }}>
        Save
      </button>
    </div>
  );
};

export default PageEditor;
