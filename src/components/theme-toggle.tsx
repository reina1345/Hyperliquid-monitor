"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Hydration mismatch回避のためマウント後に表示
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-md border border-input bg-background opacity-50 cursor-not-allowed">
        <span className="sr-only">Toggle theme</span>
        <div className="flex items-center gap-2">
          <span>Loading...</span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground border border-input bg-background transition-colors"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="flex items-center gap-2">
        {/* resolvedThemeがdarkなら、ここが表示されるはずだが、
            Tailwindのdark:クラスはHTMLのclass属性に依存する。
            next-themesはclass="dark"を付与する。

            dark:hidden -> darkモードなら隠れる
            dark:inline -> darkモードなら表示される
         */}
        <span className="hidden dark:inline">🌙 Dark</span>
        <span className="inline dark:hidden">☀️ Light</span>
      </div>
    </button>
  )
}
