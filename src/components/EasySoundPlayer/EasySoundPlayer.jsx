import { useState } from 'react';
import { CirclePlay, ChevronDown } from 'lucide-react';

export default function EasySoundPlayer() {
  const [sound, setSound] = useState(null);
  const [expend, setExpent] = useState(false);
  
  return (
    <div className="bg-lightElements dark:bg-darkElements px-6 py-3 my-5 mx-14 rounded-3xl transition duration-300 ease-in-out overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center items-center">
          <img  className="w-10 h-10 rounded-lg mr-2" />
          <div className="mb-1">
            <div className="text-light dark:text-dark text-lg">sound.title</div>
            <div className="text-gray-300 dark:text-gray-800 text-xs">sound.author</div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <CirclePlay size={30} strokeWidth={3} className={`text-light dark:text-dark transition-opacity duration-300 ${expend ? 'opacity-0 w-0' : 'opacity-100'}`}/>
          <ChevronDown 
            size={45} 
            strokeWidth={3} 
            className={`text-light dark:text-dark cursor-pointer transition-transform duration-300 ${expend ? 'rotate-180' : ''}`} 
            onClick={() => setExpent(!expend)}
          />
        </div>
      </div>
      <div className={`flex flex-col justify-center items-center overflow-hidden transition-all duration-300 ease-in-out ${
        expend ? 'max-h-40 opacity-100 m-3' : 'max-h-0 opacity-0'
      }`}>
        <CirclePlay size={30} strokeWidth={3} className='text-light dark:text-dark'/>
      </div>
    </div>
  )
}