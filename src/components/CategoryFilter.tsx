import type { Category } from '../types'
import { Chip } from './ui/Chip'

interface Props {
  categories: Category[]
  selected: string | null
  onChange: (id: string | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      <Chip selected={selected === null} onClick={() => onChange(null)}>
        Todas
      </Chip>
      {categories.map((cat) => (
        <Chip key={cat.id} selected={selected === cat.id} onClick={() => onChange(cat.id)}>
          {cat.name}
        </Chip>
      ))}
    </div>
  )
}
