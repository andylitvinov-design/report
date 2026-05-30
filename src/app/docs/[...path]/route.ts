import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params
  const safeSegments = segments.filter((segment) => segment && segment !== "..")
  const docsRoot = path.join(process.cwd(), "docs")
  const filePath = path.join(docsRoot, ...safeSegments)

  if (!filePath.startsWith(docsRoot)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  try {
    const body = await readFile(filePath)
    return new NextResponse(body, {
      headers: {
        "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream",
      },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
