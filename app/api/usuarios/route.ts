// app/api/usuarios/route.ts
import { NextResponse } from "next/server"

const BACKEND_AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8000"

async function proxyJson(req: Request, backendPath: string, method: string) {
  const backendUrl = `${BACKEND_AUTH_URL}${backendPath}`

  const cookie = req.headers.get("cookie") ?? ""

  let body: string | undefined = undefined
  if (method !== "GET" && method !== "HEAD") {
    body = await req.text()
  }

  const backendRes = await fetch(backendUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body,
  })

  const text = await backendRes.text()

  const res = new NextResponse(text, {
    status: backendRes.status,
  })

  const setCookie = backendRes.headers.get("set-cookie")
  if (setCookie) {
    res.headers.set("set-cookie", setCookie)
  }

  const contentType = backendRes.headers.get("content-type") || "application/json"
  res.headers.set("content-type", contentType)

  return res
}

export async function GET(req: Request) {
  // GET /api/usuarios -> GET /usuarios
  return proxyJson(req, "/usuarios", "GET")
}

export async function POST(req: Request) {
  // POST /api/usuarios -> POST /usuarios
  return proxyJson(req, "/usuarios", "POST")
}
