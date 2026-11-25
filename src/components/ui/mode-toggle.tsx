import { FiSun, FiMoon } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ui/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle color theme"
      title="Toggle light/dark theme"
      className="theme-toggle-btn">
      <FiSun className="theme-icon theme-icon-sun" aria-hidden="true" />
      <FiMoon className="theme-icon theme-icon-moon" aria-hidden="true" />
      <span className="sr-only">Toggle color theme</span>
    </Button>
  )
}
