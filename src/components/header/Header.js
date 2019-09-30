import React, {useState, useEffect} from 'react'
import './header.scss'
import { Link } from "react-router-dom";
import { openFormService } from '../forms/form_loader/formLoaderService';
import { RouterEnum } from '../../enums/router-enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { listCardToggleService } from './headerService';

export default function Header() {

    const [isCardsView, setIsCardsView] = useState(true);

    useEffect(() => {
        listCardToggleService.toggleIsCardsView(isCardsView);
    }, [isCardsView])


    const addClicked = () => {
        openFormService.openForm();
    }

    return (
        <div className="header" >
            <div><Link to={RouterEnum.USERS} className="app-name"> שם האפליקציה</Link></div>
            <div className="add-img" onClick={addClicked}><img src="icons/plus-big-512.png" alt="..." /></div>
            <div className={"list-view " + (!isCardsView ? "clicked " : null)} onClick={()=>setIsCardsView(false)}>
                <FontAwesomeIcon icon={faList} />
            </div>
            <div className={"cards-view " + (isCardsView ? "clicked " : null)} onClick={()=>setIsCardsView(true)}>
                <img src="icons/cards_view.png" alt="..." />
            </div>

        </div>

    )
}

