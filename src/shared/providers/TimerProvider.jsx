import {useEffect, useState} from "react";
import { TimerContext } from "../context/TimerContext";

export function TimerProvider({ children }) {

    const [time, setTime] = useState(60);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(()=>{
            let interval = null;
            if(isRunning && time>0){
                interval = setInterval(()=>{
                    setTime(time => time - 1);
                },1000)
            }
            return  () => clearInterval(interval);
        },[isRunning, time])

    return (
        <TimerContext.Provider value={{ time, setTime, isRunning, setIsRunning }}>
            {children}
        </TimerContext.Provider>
    );
}