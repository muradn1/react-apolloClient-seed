import React from 'react'
import "./cards.scss"
import Card from './card/Card'
import PropTypes from 'prop-types';    

Cards.propTypes = {
    entitiesArr: PropTypes.array.isRequired,
    leftFieldName: PropTypes.string.isRequired,
    rightFieldName: PropTypes.string.isRequired,
    subEntitesFieldName: PropTypes.string,
    subEntityFieldNameToDisplay: PropTypes.string,
    image: PropTypes.string.isRequired,
    subImage: PropTypes.string.isRequired
}

export default function Cards({entitiesArr, leftFieldName, rightFieldName, subEntitesFieldName, subEntityFieldNameToDisplay, image, subImage}) {
   
    return (
        <div className="cards">
            {
                entitiesArr.map(entity => (
                    <Card 
                        key={entity.id}
                        id={entity.id}
                        leftField={entity[leftFieldName]}
                        rightField={entity[rightFieldName]}
                        subEntitesArr={entity[subEntitesFieldName]}
                        subEntityFieldNameToDisplay={subEntityFieldNameToDisplay}
                        image={image}
                        subImage={subImage}
                    />
                ))
            }
        </div>
    )
}
