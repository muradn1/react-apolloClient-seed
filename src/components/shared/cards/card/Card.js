import React from 'react'
import "./card.scss"
import { openFormService } from '../../../forms/form_loader/formLoaderService';
import PropTypes from 'prop-types';
import { primitive } from '../../../../utils/propTypesUtils';
import SubCard from './sub_card/SubCard';

Card.propTypes = {
    id: PropTypes.string.isRequired,
    leftField: primitive,
    rightField: primitive,
    subEntitesArr: PropTypes.array,
    subEntityFieldNameToDisplay: PropTypes.string,
    image: PropTypes.string.isRequired,
    subImage: PropTypes.string.isRequired
}

export default function Card({ id, leftField, rightField, subEntitesArr, subEntityFieldNameToDisplay, image, subImage }) {

    const cardClicked = () => {
        openFormService.openForm(id);
    }

    return (
        <div className="card" onClick={cardClicked}>
            <div className="my-image">
                <img src={image} className="card-img-top" alt="..." />
            </div>
            <div className="card-body">
                <div className="fields">
                    <h6 className="rightField">{rightField}</h6>
                    <h5 className="leftField">{leftField}</h5>
                </div>
                {
                    (subEntitesArr ? (<div className="subEntites">
                        {
                            subEntitesArr.map((subEntity, i) => (
                                // <div className="subEntity" key={i}>{subEntity[subEntityFieldNameToDisplay]}</div>
                                <SubCard key={i} 
                                    field={subEntity[subEntityFieldNameToDisplay]}
                                    image={subImage}
                                 />
                            ))
                        }
                    </div>) : null)
                }
            </div>
        </div>
    )
}
