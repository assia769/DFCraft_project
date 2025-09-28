import Header from '../Header/Header.jsx'
import Body from '../Body/Boudy.jsx'
import Footer from '../Fouter/Fouter.jsx'
import { useState } from 'react';

export default function MainLayout(){

    const [choosenPage,setChoosenPage] = useState("");

    return (
        <>
            <Header setChoosenPage={setChoosenPage}/>
            <Body choosenPage={choosenPage} />
            <Footer />
        </>
    )
}