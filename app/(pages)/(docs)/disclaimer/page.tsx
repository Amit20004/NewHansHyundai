"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DynamicPage() {
  const slug="disclaimer";
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!slug) return;
    axios.get(`http://localhost:8000/api/get-content/${slug}`)
      .then(res => setContent(res.data))
      .catch(() => setContent(null));
  }, [slug]);
  console.log(content);
  

  if (!content) return <h1>404 | Page not found</h1>;

  return (
    <div className="container mx-auto p-4">
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
}
