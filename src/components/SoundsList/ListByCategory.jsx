import SoundsList from "./SoundsList";
import { useState } from "react";

export default function ListByCategory() {
  const [category, setCategory] = useState("rain");

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
        className="p-2 text-white bg-blue-500 mr-1"
      >
        {c.name}
      </div>
    );
  });

  return (
    <>
      <div className="flex items-center">{listCat}</div>
      <SoundsList category={category} />
    </>
  );
}
