import React, { useEffect, useState } from 'react'
import "./users.scss"

import { useQuery } from '@apollo/react-hooks';
import { GET_All_USERS } from "../../../graphql/UserGql"
import Cards from '../../shared/cards/Cards';
import List from '../../shared/list/List';
import { listCardToggleService } from '../../header/headerService';



export default function Users() {

    const { loading, error, data } = useQuery(GET_All_USERS, { pollInterval: 2000 });
    const [isCardsView, setIsCardsView] = useState(true);


    useEffect(() => {
        let subscription = listCardToggleService.IsCardsViewSub.subscribe(({ isCardsView }) => {
            setIsCardsView(isCardsView);
        })
        return () => {
            subscription.unsubscribe();
        };
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="users">
            {(isCardsView) ? (
                <Cards
                    entitiesArr={data.allUsers}
                    leftFieldName="firstName"
                    rightFieldName="lastName"
                    subEntitesFieldName="children"
                    subEntityFieldNameToDisplay="name"
                    image="icons/plane.png"
                    subImage="icons/missile.png"
                />) : (
                <List
                    entitiesArr={data.allUsers}
                    fieldsNamesArr={["firstName","lastName","email"]}
                    image="icons/plane.png"
                />
            )}
        </div>
    );
}
