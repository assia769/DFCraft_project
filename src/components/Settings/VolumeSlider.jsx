import { Volume2, VolumeX } from 'lucide-react';

export default function VolumeSlider({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <VolumeX className="w-4 h-4 text-lightPlaceHolder dark:text-darkPlaceHolder" />
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1 h-2 bg-lightList dark:bg-darkList rounded-full appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, 
            var(--tw-gradient-from) 0%, 
            var(--tw-gradient-from) ${value}%, 
            var(--tw-gradient-to) ${value}%, 
            var(--tw-gradient-to) 100%)`,
          '--tw-gradient-from': 'rgb(124, 58, 237)',
          '--tw-gradient-to': 'rgb(229, 231, 235)',
        }}
      />
      <Volume2 className="w-4 h-4 text-lightElements dark:text-darkElements" />
      <span className="text-sm font-medium text-lightElements dark:text-darkElements min-w-[3ch] text-right">
        {value}
      </span>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          color: rgb(124, 58, 237);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
          color: rgb(124, 58, 237);
        }
      `}</style>
    </div>
  );
}