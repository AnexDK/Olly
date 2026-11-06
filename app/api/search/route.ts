import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Skriv hvad du vil søge efter." }, { status: 400 });
  if (q.length > 120) return NextResponse.json({ error: "Søgningen er for lang." }, { status: 400 });
  const key = process.env.SERPAPI_KEY;
  if (!key) return NextResponse.json({ error: "Produktsøgning er ikke sat op endnu. Tilføj SERPAPI_KEY i .env.local." }, { status: 503 });
  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_shopping");
    url.searchParams.set("q", q);
    url.searchParams.set("gl", "dk");
    url.searchParams.set("hl", "da");
    url.searchParams.set("api_key", key);
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error("Shopping-søgetjenesten svarede ikke korrekt.");
    const data = await response.json();
    const products = (data.shopping_results || []).map((p: Record<string, unknown>) => ({
      title: p.title || "Produkt",
      price: p.price || "",
      extracted_price: typeof p.extracted_price === "number" ? p.extracted_price : undefined,
      source: p.source || "",
      link: p.product_link || p.link || "",
      thumbnail: p.thumbnail || "",
      delivery: p.delivery || "",
      rating: typeof p.rating === "number" ? p.rating : undefined,
      reviews: typeof p.reviews === "number" ? p.reviews : undefined
    }));
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Søgningen fejlede." }, { status: 502 });
  }
}
