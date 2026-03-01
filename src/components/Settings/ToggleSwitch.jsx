export default function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        checked
          ? 'bg-lightElements dark:bg-darkElements'
          : 'bg-lightPlaceHolder dark:bg-darkPlaceHolder opacity-50'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
}