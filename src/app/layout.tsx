import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"

import { AuthEntryButton } from "@/components/auth/auth-entry-button"
import { getAuthContext } from "@/lib/server/auth"
import "../styles.css"

export const metadata: Metadata = {
  title: "Holistic Therapy Cabinet",
  description: "Client cabinet with Google authorization and report history.",
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext()

  return (
    <html lang="ru">
      <body>
        <header className="site-header">
          <Link className="site-logo" href="/">
            Holistic Therapy
          </Link>
          <nav>
            <Link href="/cabinet">Кабинет</Link>
            <Link href="/docs/client-cabinet/prototype/overview.html">Прототип</Link>
          </nav>
          <AuthEntryButton auth={auth} />
        </header>
        {children}
      </body>
    </html>
  )
}
