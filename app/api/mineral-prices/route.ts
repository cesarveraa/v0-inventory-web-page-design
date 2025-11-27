import { NextResponse } from "next/server"

const METALS = ["gold", "silver", "copper", "zinc", "lead"] as const
type Metal = (typeof METALS)[number]

const OUNCE_TO_GRAM = 1 / 31.1035
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

type MetalsDevResponse = {
  price: number | string
  metal: string
  currency: string
  timestamp: string
}

type MineralResult = {
  metal: string
  currency: string
  pricePerOunce: number
  pricePerGram: number
  timestamp: string
}

// 🧠 Caché en memoria (por instancia)
let mineralCache: { data: MineralResult[]; fetchedAt: number } | null = null

function buildDummyData(): MineralResult[] {
  const now = new Date().toISOString()

  // Valores EJEMPLO en Bs/onza (ajusta a lo que quieras)
  const basePrices: Record<Metal, number> = {
    gold: 15000, // Oro
    silver: 200, // Plata
    copper: 20,  // Cobre
    zinc: 18,    // Zinc
    lead: 10,    // Plomo
  }

  return (Object.keys(basePrices) as Metal[]).map((metal) => {
    const base = basePrices[metal]
    return {
      metal,
      currency: "BOB",
      pricePerOunce: base,
      pricePerGram: base * OUNCE_TO_GRAM,
      timestamp: now,
    }
  })
}

export async function GET() {
  const now = Date.now()
  const apiKey = process.env.METALS_DEV_API_KEY

  // ✅ Si la caché está fresca (< 1h), devolvemos eso y NO llamamos al API externo
  if (mineralCache && now - mineralCache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ data: mineralCache.data, cached: true })
  }

  // 🔹 Sin API key → dummy data (no gasta requests externos)
  if (!apiKey) {
    console.warn(
      "[/api/mineral-prices] METALS_DEV_API_KEY no definida, usando datos de ejemplo.",
    )
    const dummy = buildDummyData()
    mineralCache = { data: dummy, fetchedAt: now }
    return NextResponse.json({ data: dummy, cached: true })
  }

  try {
    const results: MineralResult[] = await Promise.all(
      METALS.map(async (metal: Metal) => {
        const url = `https://api.metals.dev/v1/metal/spot?api_key=${apiKey}&metal=${metal}&currency=BOB`

        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Error obteniendo ${metal}: ${res.status}`)
        }

        const data = (await res.json()) as MetalsDevResponse

        const rawPrice = Number(data.price)
        if (!Number.isFinite(rawPrice)) {
          throw new Error(`Precio inválido para ${metal}: ${data.price}`)
        }

        const pricePerOunce = rawPrice
        const pricePerGram = rawPrice * OUNCE_TO_GRAM

        return {
          metal,
          currency: data.currency,
          pricePerOunce,
          pricePerGram,
          timestamp: data.timestamp,
        }
      }),
    )

    mineralCache = { data: results, fetchedAt: now }

    return NextResponse.json({ data: results, cached: false })
  } catch (error) {
    console.error(
      "Error cargando precios de minerales, usando datos de ejemplo:",
      error,
    )

    const fallback = mineralCache?.data ?? buildDummyData()
    mineralCache = { data: fallback, fetchedAt: now }

    return NextResponse.json({ data: fallback, cached: true })
  }
}
