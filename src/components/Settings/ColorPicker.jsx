import { Check } from 'lucide-react';

export default function ColorPicker({ value, onChange, options }) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
            value === option.value ? 'ring-2 ring-offset-2 ring-lightElements dark:ring-darkElements' : ''
          }`}
          style={{ backgroundColor: option.color }}
          title={option.label}
        >
          {value === option.value && (
            <Check className="w-5 h-5 text-white mx-auto" />
          )}
        </button>
      ))}
    </div>
  );
}