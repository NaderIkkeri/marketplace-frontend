"use client";

import { useState } from "react";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, category, file });
    alert("✅ Form submitted (check console for data)");
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Create New Dataset</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter dataset title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Write a short description..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            <option value="finance">Finance</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-gray-400
              file:mr-3 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
