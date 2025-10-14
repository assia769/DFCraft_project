import {useEffect,useState} from "react";
import axios from "axios";
import config from "../../shared/constants/config";

export default function SoundsList({category}){

    const catURL = config.SoundLibraryApi;
    const [soundsByCat, setSoundsByCat] = useState(null);

    useEffect(()=>{
        const fetchSoundsByCat = async () => {
            try{
                const res = await axios.get(catURL);
                const data = res.data;
                setSoundsByCat(data);
            }catch(err){
                console.error(err);
            }
        }

        fetchSoundsByCat();
    },[])

     if (!soundsByCat) {
        return <div className="p-4">Loading...</div>;
    }

    // ✅ RETURN EARLY IF NO SOUNDS PROPERTY
    if (!soundsByCat.sounds) {
        return <div className="p-4">No sounds data</div>;
    }

    const { sounds } = soundsByCat  ;

    const filteredSounds = sounds.filter(s => s.category === category);

    if (filteredSounds.length === 0) {
        return <div className="p-4">No sounds in "{category}"</div>;
    }

    const soundslist = filteredSounds.map((s) => {
        return (<div className="flex item-center justify-start w-full" key={s.id}>
            <img src={s.coverImage} alt={s.title} className="w-10 h-10"></img>
            <div>
                <div>{s.title}</div>
                <div>{s.duration / 60}</div>
            </div>
        </div>)
    })

    return(<>{soundslist}</>)
}