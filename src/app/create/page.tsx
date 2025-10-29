"use client";

import { useState } from "react";
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import the router

// (The TagsInput component code remains the same as you provided)
function TagsInput({ onChange }: { onChange: (tags: string[]) => void }) {
  // ... your existing TagsInput component code ...
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const suggestedTags = ["AI", "Healthcare", "Climate", "Finance", "Education", "Blockchain", "Agriculture", "Transportation", "Energy", "Sports"];
  const addTag = (tag: string) => { if (tag.trim() !== "" && !tags.includes(tag)) { const updated = [...tags, tag.trim()]; setTags(updated); onChange(updated); } setInputValue(""); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") { e.preventDefault(); addTag(inputValue); } };
  const removeTag = (tagToRemove: string) => { const updated = tags.filter((tag) => tag !== tagToRemove); setTags(updated); onChange(updated); };
  const filteredSuggestions = suggestedTags.filter((tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag));
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 border border-gray-600 rounded-lg p-2 bg-gray-900">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={5} />
            </button>
          </span>
        ))}
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none text-white" placeholder="Type and press Enter" />
      </div>
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
          {filteredSuggestions.map((suggestion, idx) => (
            <div key={idx} onClick={() => addTag(suggestion)} className="px-3 py-2 hover:bg-indigo-600 cursor-pointer rounded-lg">{suggestion}</div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function CreatePage() {
  // 1. Existing form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [format, setFormat] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  // (We'll ignore license and sample for now to keep it simple)

  // 2. New state for handling uploads and submissions
  const [ipfsCid, setIpfsCid] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<string>("");

  // 3. Get wallet context and router for navigation
  const { contract, signer } = useWallet();
  const router = useRouter();

  // 4. Function to handle file upload to our API route -> Pinata
  const handleUploadToIpfs = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }
    setUploadStatus("Uploading to IPFS...");
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        setUploadStatus(`✅ Upload successful!`);
        setIpfsCid(data.cid);
      } else {
        setUploadStatus(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      setUploadStatus("Upload failed. See console for details.");
      console.error(error);
    }
  };

  // 5. Function to handle final submission to the blockchain
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipfsCid) {
      setSubmitStatus("Please upload a file to IPFS first.");
      return;
    }
    if (!contract || !signer) {
      setSubmitStatus("Please connect your wallet first.");
      return;
    }

    setSubmitStatus("Submitting transaction to the blockchain...");

    try {
      // Convert price from ETH string to wei BigInt
      const priceInWei = ethers.parseEther(price);
      
      const tx = await contract.createDataset(
        name,
        description,
        category,
        format,
        ipfsCid,
        priceInWei
      );

      setSubmitStatus("Waiting for transaction confirmation...");
      await tx.wait(); // Wait for the transaction to be mined

      setSubmitStatus("✅ Dataset created successfully! Redirecting...");
      // Redirect to the browse page after a short delay
      setTimeout(() => router.push('/browse'), 2000);

    } catch (error) {
      setSubmitStatus("Transaction failed. See console for details.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Create New Dataset</h1>

      {/* --- Part 1: IPFS Upload --- */}
      <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg mb-6">
        <label className="block text-lg font-medium">Step 1: Upload Your Data</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />
        <button
          type="button"
          onClick={handleUploadToIpfs}
          className="w-full py-2 px-4 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-500"
          disabled={!file || uploadStatus.includes('Uploading')}
        >
          {uploadStatus.includes('Uploading') ? 'Uploading...' : 'Upload to IPFS'}
        </button>
        {uploadStatus && <p className="text-sm text-center text-gray-400">{uploadStatus}</p>}
        {ipfsCid && (
          <div className="p-2 bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500">IPFS CID:</p>
            <p className="font-mono text-green-400 break-all text-sm">{ipfsCid}</p>
          </div>
        )}
      </div>

      {/* --- Part 2: Submit Metadata --- */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-lg font-medium">Step 2: Add Details & Submit</label>
        
        {/* Title, Description, Category, etc. */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500" placeholder="Enter dataset title"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500" placeholder="Write a short description..."/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select category</option>
                    <option value="Finance">Finance</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Dataset Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} required className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select format</option>
                    <option value="CSV">CSV</option>
                    <option value="JSON">JSON</option>
                    <option value="Parquet">Parquet</option>
                    <option value="Images">Images</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (ETH)</label>
          <input type="number" step="0.001" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 0.05"/>
        </div>
        <TagsInput onChange={setTags} />

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!ipfsCid || submitStatus.includes('Submitting') || submitStatus.includes('Waiting')}
        >
          {submitStatus.includes('Submitting') || submitStatus.includes('Waiting') ? 'Processing...' : 'Submit Dataset to Blockchain'}
        </button>
        {submitStatus && <p className="text-sm text-center text-gray-400 mt-4">{submitStatus}</p>}
      </form>
    </div>
  );
}