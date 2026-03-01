export default function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 bg-light dark:bg-dark border border-lightPlaceHolder dark:border-darkPlaceHolder rounded-lg text-lightElements dark:text-darkElements focus:outline-none focus:ring-2 focus:ring-lightElements dark:focus:ring-darkElements transition-all"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.flag && `${option.flag} `}
          {option.label}
        </option>
      ))}
    </select>
  );
}