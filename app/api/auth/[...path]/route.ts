// app/api/auth/[...path]/route.ts
import { NextResponse } from "next/server"

const BACKEND_AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL

// Helper genérico para proxear JSON y reenviar cookies
async function proxyJson(req: Request, backendPath: string, method: string) {
  const backendUrl = `${BACKEND_AUTH_URL}${backendPath}`

  // Copiamos cookies de la request que llega al API Route
  const cookie = req.headers.get("cookie") ?? ""

  // Cuerpo de la request (solo para métodos con body)
  let body: string | undefined = undefined
  if (method !== "GET" && method !== "HEAD") {
    body = await req.text() // pasamos el raw body al backend
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

  // Construimos la respuesta para el navegador
  const res = new NextResponse(text, {
    status: backendRes.status,
  })

  // Reenviar la cookie que envía FastAPI (Set-Cookie)
  const setCookie = backendRes.headers.get("set-cookie")
  if (setCookie) {
    res.headers.set("set-cookie", setCookie)
  }

  // Content-Type
  const contentType = backendRes.headers.get("content-type") || "application/json"
  res.headers.set("content-type", contentType)

  return res
}

// POST -> /api/auth/login o /api/auth/logout
export async function POST(req: Request) {
  const url = new URL(req.url)
  // /api/auth/login -> "login", /api/auth/logout -> "logout"
  const subpath = url.pathname.replace(/^\/api\/auth\/?/, "")

  if (subpath === "login") {
    // Proxy a POST /auth/login del backend
    return proxyJson(req, "/auth/login", "POST")
  }

  if (subpath === "logout") {
    // Proxy a POST /auth/logout del backend
    return proxyJson(req, "/auth/logout", "POST")
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 })
}

// GET -> /api/auth/me
export async function GET(req: Request) {
  const url = new URL(req.url)
  const subpath = url.pathname.replace(/^\/api\/auth\/?/, "")

  if (subpath === "me") {
    // Proxy a GET /auth/me del backend
    return proxyJson(req, "/auth/me", "GET")
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 })
}
