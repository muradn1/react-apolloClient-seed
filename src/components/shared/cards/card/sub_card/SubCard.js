import React from 'react'
import "./subCard.scss"
import PropTypes from 'prop-types';
import { primitive } from '../../../../../utils/propTypesUtils'

SubCard.propTypes = {
    field: primitive,
    image: PropTypes.string.isRequired,
}

export default function SubCard({ field, image }) {
    return (
        <div className="card sub-entity">
            <div className="my-image">
                <img src={image} className="card-img-top" alt="..." />
            </div>
            <div className="field">
                {field}
            </div>
        </div>
    )
}
