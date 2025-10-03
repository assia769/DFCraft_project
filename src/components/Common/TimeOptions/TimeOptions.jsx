export default function TimeOptions({workTime, BreakTime, setMin, setSec, setBMin, setBSec, originalWorkTime, originalBreakTime}){

    const handleChangeTime = () => {
        setMin(workTime);
        setSec(0);
        setBMin(BreakTime);
        setBSec(0);
    }

    const colCondition = originalWorkTime === workTime && originalBreakTime === BreakTime;
    const Col = colCondition ? "bg-blue-700 text-blue-300" : "bg-white text-blue-700"

    return (
        <div className={`font-pixelo  p-2 mr-1 rounded-lg w-min ${Col}`} onClick={handleChangeTime}>
            <p className="flex justify-center items-center">{workTime}+{BreakTime}</p>
        </div>
    )
}