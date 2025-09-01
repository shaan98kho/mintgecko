import { useEffect } from "react";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string
const BASE_URL = 'https://api.coingecko.com/api/v3'
export type PingResponse = { gecko_says: string }

export async function ping(): Promise<PingResponse> {
  const res = await fetch(`${BASE_URL}/ping`, {
    headers: new Headers({
      'x-cg-demo-api-key': API_KEY,
    }),
  });
  if (!res.ok) throw new Error(`Ping failed: ${res.status}`);
  return res.json();
}

export default function Home() {
  useEffect(() => {
    console.log(ping())
  }, [])

  return <div>
    this is home
  </div>;
}