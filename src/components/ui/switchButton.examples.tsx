// Example usage of SwitchButton component

import { SwitchButton, SwitchButtonOption } from "@/components/ui/switchButton"
import { Calendar } from "lucide-react"

// Example 1: Basic usage with icons (single selection by default)
export function BasicSwitchButtonExample() {
  const viewOptions: SwitchButtonOption[] = [
      {
      id: "calendar",
      icon: <Calendar className="h-4 w-4" />,
      onClick: () => console.log("Calendar view selected"),
    },
  ]

  return (
    <SwitchButton
      options={viewOptions}
      defaultSelected="grid"
      onSelectionChange={(selectedId) => {
        console.log("Selection changed to:", selectedId)
      }}
    />
  )
}

// Example 2: Multiple selection mode
export function MultipleSwitchButtonExample() {
  const filterOptions: SwitchButtonOption[] = [
    {
      id: "active",
      icon: <span className="text-xs font-medium">Active</span>,
      onClick: () => console.log("Active filter toggled"),
    },
    {
      id: "pending",
      icon: <span className="text-xs font-medium">Pending</span>,
      onClick: () => console.log("Pending filter toggled"),
    },
    {
      id: "completed",
      icon: <span className="text-xs font-medium">Done</span>,
      onClick: () => console.log("Completed filter toggled"),
    },
  ]

  return (
    <SwitchButton
      options={filterOptions}
      allowMultiple={true}
      size="sm"
    />
  )
}

// Example 3: Different sizes
export function SizedSwitchButtonExample() {
  const sizeOptions: SwitchButtonOption[] = [
    {
      id: "small",
      icon: <span className="text-xs">S</span>,
    },
    {
      id: "medium",
      icon: <span className="text-xs">M</span>,
    },
    {
      id: "large",
      icon: <span className="text-xs">L</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Small</p>
        <SwitchButton options={sizeOptions} size="sm" />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <SwitchButton options={sizeOptions} />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Large</p>
        <SwitchButton options={sizeOptions} size="lg" />
      </div>
    </div>
  )
}
