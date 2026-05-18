import { FiSun, FiMoon } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ui/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(isSystemDark ? "light" : "dark")
    } else {
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle theme"
      className="h-10 w-10 relative">
      <FiSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:scale-0 dark:-rotate-90 pointer-events-none" />
      <FiMoon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 pointer-events-none" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
