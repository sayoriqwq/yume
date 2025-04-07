import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface DataTableCellWithSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  enabledText?: string
  disabledText?: string
}

export function DataTableCellWithSwitch({
  checked,
  onCheckedChange,
  label,
  enabledText = '已启用',
  disabledText = '已禁用',
}: DataTableCellWithSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
      <Label className={checked ? 'text-green-500' : 'text-red-500'}>
        {checked ? enabledText : disabledText}
      </Label>
    </div>
  )
}
