import type { Category } from '../types'

interface Props {
  categories: Category[]
  selected: string | null
  onChange: (id: string | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-brand-600 text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-brand-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
