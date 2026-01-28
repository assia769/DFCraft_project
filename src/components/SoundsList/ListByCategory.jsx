import axios from "axios";
import SoundsList from "./SoundsList";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { ListFilter } from "lucide-react";
import DisplayCatigories from "./DisplayCatigories";

export default function ListByCategory() {
  
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showCats, setShowCats] = useState(false);

  return (
    <div className="bg-light dark:bg-dark">
      <div className="flex flex-row justify-between items-center mb-2">
        <input type="text" placeholder="Search for sound, Author..." className="p-2 mr-2 rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder w-full ml-6" />
        <button
          onClick={() => { setShowCats(true);}}
          className="transition-colors relative mr-6"
          aria-label="Menu"
        >
          <ListFilter className="w-6 h-6 text-lightElements dark:text-darkElements"/>
        </button>
      </div>
      <SoundsList category={category} />
      {
        showCats
        &&
        <DisplayCatigories category={category} categories={categories} setCategory={setCategory} setCategories={setCategories} setShowCats={setShowCats}/>
      }
    </div>
  );
}
