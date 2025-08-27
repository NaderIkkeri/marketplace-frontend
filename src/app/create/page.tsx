"use client";

import { useState } from "react";

// ✅ TagsInput component
function TagsInput({ onChange }: { onChange: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Suggested tags
  const suggestedTags = [
    "AI",
    "Healthcare",
    "Climate",
    "Finance",
    "Education",
    "Blockchain",
    "Agriculture",
    "Transportation",
    "Energy",
    "Sports",
  ];

  // Add tag
  const addTag = (tag: string) => {
    if (tag.trim() !== "" && !tags.includes(tag)) {
      const updated = [...tags, tag.trim()];
      setTags(updated);
      onChange(updated);
    }
    setInputValue("");
  };

  // Handle Enter/Space key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove);
    setTags(updated);
    onChange(updated);
  };

  // Filter suggestions
  const filteredSuggestions = suggestedTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(tag)
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 border border-gray-600 rounded-lg p-2 bg-gray-900">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-xs text-gray-200 hover:text-red-400"
            >
              ❌
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Type and press Enter"
        />
      </div>

      {/* Suggestions dropdown */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
          {filteredSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => addTag(suggestion)}
              className="px-3 py-2 hover:bg-indigo-600 cursor-pointer rounded-lg"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Main CreatePage form
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [license, setLicense] = useState("");
  const [format, setFormat] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sample, setSample] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      category,
      file,
      price,
      license,
      format,
      tags,
      sample,
    });
    alert("✅ Dataset form submitted (check console for data)");
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Create New Dataset</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="block text-sm font-medium mb-1">Upload Dataset</label>
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

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 0.05"
          />
        </div>

        {/* License */}
        <div>
          <label className="block text-sm font-medium mb-1">License Type</label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select license</option>
            <option value="open">Open Source</option>
            <option value="research">Research Only</option>
            <option value="commercial">Commercial Use</option>
            <option value="custom">Custom License</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium mb-1">Dataset Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select format</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="excel">Excel</option>
            <option value="parquet">Parquet</option>
            <option value="images">Images</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* ✅ Tags Component */}
        <TagsInput onChange={setTags} />

        {/* Sample Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Sample File (Optional)</label>
          <input
            type="file"
            onChange={(e) => setSample(e.target.files?.[0] || null)}
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
          Submit Dataset
        </button>
      </form>
    </div>
  );
}
