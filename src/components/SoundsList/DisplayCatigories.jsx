import { useEffect} from 'react';
import axios from 'axios';
import { Skeleton } from "@mui/material";
import config from "../../shared/constants/config";
import "./DisplaySound.css";

export default function DisplayCatigories({ category, categories, setCategory ,setCategories, setShowCats}) {
  
  const catURL = config.SoundLibraryApi;
  
  useEffect(() => {
    const featchCategories = async () => {
      try {
        const res = await axios.get(catURL);
        const data = res.data.categories;
        console.log(data)
        setCategories([{id:"all", name:"All"}, ...data]); 
      } catch (err) {
        console.error(err)
      }
    }
    featchCategories();
  }, []);
  
  
  const selectedCat = (c) => {
    return c === category ? "text-light dark:text-dark bg-lightElements dark:bg-darkElements rounded-3xl py-1 px-3 min-w-fit" : "text-light dark:text-dark bg-lightList dark:bg-darkList rounded-3xl py-1 px-3 min-w-fit  hover:shadow-lg hover: shadow-black transition-all"
  }

  const listCat = categories.length > 0 ? (
    categories.map((c) => {
      return (
        <div
          key={c.id}
          onClick={() => setCategory(c.id)}
          className={"flex flex-row justify-start items-center select-none cursor-pointer transition-all " + selectedCat(c.id)}
        >
          {c.name}
        </div>
      );
    })
  ):(<div className="flex flex-row justify-start items-center p-2">
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
    </div>
  );
  
  return (<>
    <div 
      className="fixed inset-0 bg-light dark:bg-dark opacity-30 backdrop-blur-sm"
      onClick={() => setShowCats(false)}
    />
    <div className='fixed bottom-0 rounded-t-3xl w-full bg-lightElements dark:bg-darkElements p-6 BtoT'>
      <h1 className='text-3xl mb-4 text-light dark:text-dark'>Categories:</h1>
      <div className='flex flex-wrap gap-2'>
        {listCat}
      </div>
    </div>
  </>)
}