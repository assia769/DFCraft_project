import { useEffect, useState } from "react";

function SelectUrlState({ setElements }) {
  const [selected, setSelected] = useState(""); // string au lieu de []

  const handleChange = (e) => {
    setSelected(e.target.value); // valeur unique
  };

  useEffect(() => {
    if (selected === "sownd") {
      setElements((prv) =>
        prv.map(item => ({ ...item, sowndBlocked: true }))
      );
    } else if (selected === "acces") {
      setElements((prv) =>
        prv.map(item => ({ ...item, urlBlocked: true }))
      );
    } else if (selected === "both") {
      setElements((prv) =>
        prv.map(item => ({ ...item, urlBlocked: true, sowndBlocked: true }))
      );
    }
  }, [selected, setElements]);

  return (
    <div className="flex justify-end items-center dark:text-black text-white  ">
      <select value={selected} onChange={handleChange} className=" p-2 rounded focus:outline-none dark:bg-darkElements bg-[#5B1FC0]">
        <option value="">Select</option>
        <option value="sownd">Sownd</option>
        <option value="acces">Acces</option>
        <option value="both">Both</option>
      </select>
    </div>
  );
}

export default SelectUrlState;

