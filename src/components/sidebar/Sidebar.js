import React from 'react'
import { Link } from "react-router-dom";
import "./sidebar.scss"
import { RouterEnum } from '../../enums/router-enum';

export default function Sidebar() {
    return (
        <div className="sidebar">
                <div className="link"><Link to={RouterEnum.USERS}>users</Link></div>
                <div className="link"><Link to={RouterEnum.OTHER}>other</Link></div>
        </div>
    )
}
