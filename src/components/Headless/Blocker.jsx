import useBlockUrl from '../../shared/hooks/useBlockUrl';

const Blocker = ({BlockedItem , isRunning}) => {
    useBlockUrl(BlockedItem , isRunning);
    return (
        <></>
    );
};



export default Blocker;