import { ChevronDown, Settings } from "lucide-react"

export function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <button className="quick-settings-button">
          Quick Settings
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="header-right">
        <button className="model-selector">
          GPT-4 Turbo
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
