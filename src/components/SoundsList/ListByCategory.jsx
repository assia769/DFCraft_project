import SoundsList from "./SoundsList";
import { useState } from "react";

export default function ListByCategory() {
  const [category, setCategory] = useState("rain");
  const selectedCat = (n) => {
    return n === category ? "text-white bg-blue-500 mr-1 rounded-md hover:bg-blue-700" : "text-blue-500 bg-gray-100 mr-1 rounded-md hover:bg-blue-700 hover:text-white"
  }

  const categories = [
    {
      id: "rain",
      name: "Rain & Thunder",
    },
    {
      id: "nature",
      name: "Nature & Forest",
    },
    {
      id: "white-noise",
      name: "White Noise",
    },
    {
      id: "cafe-indoor",
      name: "Café & Indor",
    },
  ];

  const listCat = categories.map((c) => {
    return (
      <div
        key={c.id}
        onClick={() => setCategory(c.id)}
        className={`p-2  transition font-medium ${selectedCat(c.id)}`}
      >
        {c.name}
      </div>
    );
  });

  return (
    <>
      <div className="flex items-center justify-center p-2">{listCat}</div>
      <SoundsList category={category} />
    </>
  );
}
