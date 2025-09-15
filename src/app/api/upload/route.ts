import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the form data from the incoming request
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file found." });
    }

    // 2. Create a new FormData object to send to Pinata
    const formData = new FormData();
    formData.append('file', file);

    // 3. Send the file to Pinata's pinning endpoint
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`, // Use the JWT for authentication
      },
      body: formData,
    });

    const { IpfsHash } = await res.json();
    
    // 4. Return the IPFS hash (CID) to the client
    return NextResponse.json({ success: true, cid: IpfsHash });

  } catch (e) {
    console.error("Error uploading to Pinata:", e);
    return NextResponse.json({ success: false, error: "Error uploading file." });
  }
}