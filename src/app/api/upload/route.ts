import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file found." });
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    const pinataResponse = await res.json();
    
    // This is the added debug line
    console.log("Response from Pinata:", pinataResponse); 

    const { IpfsHash } = pinataResponse;
    
    return NextResponse.json({ success: true, cid: IpfsHash });

  } catch (e) {
    console.error("Error uploading to Pinata:", e);
    return NextResponse.json({ success: false, error: "Error uploading file." });
  }
}