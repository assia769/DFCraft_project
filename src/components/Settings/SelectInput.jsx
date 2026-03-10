export default function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 bg-lightElements dark:bg-darkElements border border-light dark:border-dark rounded-lg text-light dark:text-dark focus:outline-none focus:ring-2 focus:ring-lightElements dark:focus:ring-darkElements transition-all"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}