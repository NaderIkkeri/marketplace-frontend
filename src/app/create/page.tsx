"use client";

import { useState } from "react";
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ButtonSpinner from "@/components/common/ButtonSpinner";

// (TagsInput component remains exactly the same)
function TagsInput({ onChange }: { onChange: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const suggestedTags = ["AI", "Healthcare", "Climate", "Finance", "Education", "Blockchain", "Agriculture", "Transportation", "Energy", "Sports"];
  const addTag = (tag: string) => { if (tag.trim() !== "" && !tags.includes(tag)) { const updated = [...tags, tag.trim()]; setTags(updated); onChange(updated); } setInputValue(""); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") { e.preventDefault(); addTag(inputValue); } };
  const removeTag = (tagToRemove: string) => { const updated = tags.filter((tag) => tag !== tagToRemove); setTags(updated); onChange(updated); };
  const filteredSuggestions = suggestedTags.filter((tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag));
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-300">Tags</label>
      <div className="flex flex-wrap gap-2 border border-white/10 rounded-2xl p-3 bg-white/5 focus-within:border-purple-500/50 transition-all">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-purple-300 hover:text-red-400 transition-colors">
              <X className="h-3 w-3" strokeWidth={3} />
            </button>
          </span>
        ))}
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-gray-500" placeholder="Type and press Enter" />
      </div>
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden">
          {filteredSuggestions.map((suggestion, idx) => (
            <div key={idx} onClick={() => addTag(suggestion)} className="px-4 py-3 hover:bg-purple-500/20 cursor-pointer transition-colors text-white">{suggestion}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [format, setFormat] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [ipfsCid, setIpfsCid] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { contract, walletAddress } = useWallet();
  const router = useRouter();

  // 1. UPDATED: Upload to Django Backend (Secure Processing Node)
  const handleUploadToIpfs = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    if (!walletAddress) {
        toast.error("Please connect your wallet.");
        return;
    }
    
    setIsUploading(true);
    const loadingToastId = toast.loading("Encrypting & Uploading to Processing Node...");

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name || file.name);
      formData.append('owner_address', walletAddress); // Backend needs this for ownership linking

      // Sending to Django Backend (Secure Upload Endpoint)
      const response = await fetch('http://localhost:8000/api/datasets/secure-upload/', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();

      if (data.success) {
        toast.success("✅ Secure Upload successful!", { id: loadingToastId });
        setIpfsCid(data.ipfs_cid);
      } else {
        toast.error(`Upload failed: ${data.error}`, { id: loadingToastId });
      }
    } catch (error) {
      toast.error("Upload failed. Is Django running on port 8000?", { id: loadingToastId });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 2. UPDATED: Submit to Blockchain AND Finalize in Django
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipfsCid) {
      toast.error("Please upload a file to IPFS first.");
      return;
    }
    if (!contract || !walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Submitting to blockchain...");

    try {
      const priceInWei = ethers.parseEther(price);
      
      // A) Mint the NFT
      const tx = await contract.createDataset(
        name,
        description,
        category,
        format,
        ipfsCid,
        priceInWei
      );

      toast.loading("Waiting for block confirmation...", { id: loadingToastId });
      const receipt = await tx.wait();
      
      // B) Get the new Token ID (Simple assumption for MVP: It's the last token owned by user)
      // In production, parse logs from 'receipt' to be exact.
      const balance = await contract.balanceOf(walletAddress);
      const newTokenIdBigInt = await contract.tokenOfOwnerByIndex(walletAddress, balance - 1n);
      const newTokenId = newTokenIdBigInt.toString();

      // C) Finalize with Django (Link CID to TokenID)
      toast.loading("Finalizing secure record...", { id: loadingToastId });
      
      await fetch('http://localhost:8000/api/datasets/finalize/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipfs_cid: ipfsCid,
          token_id: newTokenId,
          owner_address: walletAddress
        })
      });

      toast.success("✅ Dataset created successfully!", { id: loadingToastId });
      setTimeout(() => router.push('/browse'), 2000);

    } catch (error) {
      toast.error("Transaction failed. See console.", { id: loadingToastId });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">
            Create <span className="glow-text-purple">Dataset</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Upload and monetize your verified data on the blockchain
          </p>

          {/* --- Part 1: Secure Upload --- */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold">Secure Upload & Encrypt</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white hover:file:opacity-90 file:cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 ml-2">Your file will be encrypted by our Processing Node before storage.</p>

              <button
                type="button"
                onClick={handleUploadToIpfs}
                className="w-full h-12 flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full font-semibold hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!file || isUploading}
              >
                {isUploading ? <ButtonSpinner /> : 'Encrypt & Upload'}
              </button>

              {ipfsCid && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <p className="text-xs text-green-400 mb-1 font-semibold">✅ Secure Storage Successful</p>
                  <p className="text-xs text-gray-500 mb-1">Encrypted IPFS CID:</p>
                  <p className="font-mono text-green-300 break-all text-sm">{ipfsCid}</p>
                </div>
              )}
            </div>
          </div>

          {/* --- Part 2: Submit Metadata --- */}
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8">
            {/* ... (Form fields for Title, Description, etc. remain exactly the same) ... */}
             <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold">Add Dataset Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" placeholder="Enter dataset title"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none" placeholder="Describe your dataset..."/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-gray-900">Select category</option>
                    <option value="Finance" className="bg-gray-900">Finance</option>
                    <option value="Health" className="bg-gray-900">Health</option>
                    <option value="Education" className="bg-gray-900">Education</option>
                    <option value="Technology" className="bg-gray-900">Technology</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-gray-900">Select format</option>
                    <option value="CSV" className="bg-gray-900">CSV</option>
                    <option value="JSON" className="bg-gray-900">JSON</option>
                    <option value="Parquet" className="bg-gray-900">Parquet</option>
                    <option value="Images" className="bg-gray-900">Images</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Price (ETH)</label>
                <input type="number" step="0.001" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" placeholder="e.g. 0.05"/>
              </div>
              <TagsInput onChange={setTags} />

              <button
                type="submit"
                className="w-full h-14 flex justify-center items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!ipfsCid || isSubmitting}
              >
                {isSubmitting ? <ButtonSpinner /> : 'Submit Dataset to Blockchain'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}