import axios from "axios";
import SoundsList from "./SoundsList";
import { useEffect, useState } from "react";
import config from "../../shared/constants/config";
import { Skeleton } from "@mui/material";

export default function ListByCategory() {
  const catURL = config.SoundLibraryApi;
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const selectedCat = (c) => {
    return c === category ? "text-white bg-blue-500 mr-1 rounded-md hover:bg-blue-700" : "text-blue-500 bg-gray-100 mr-1 rounded-md hover:bg-blue-700 hover:text-white"
  }
  
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

  const listCat = categories.length > 0 ? (
    categories.map((c) => {
      return (
        <div
          key={c.id}
          onClick={() => setCategory(c.id)}
          className={`p-2 whitespace-nowrap transition font-medium ${selectedCat(c.id)}`}
        >
          {c.name}
        </div>
      );
    })
  ):(<div className="flex flex-row items-center p2">
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
      <Skeleton variant="rounded" width={80} height={40} className="mr-2"/>
    </div>
  );

  return (
    <>
      <div className="flex items-center overflow-x-auto whitespace-nowrap p-2">{listCat}</div>
      <SoundsList category={category} />
    </>
  );
}
