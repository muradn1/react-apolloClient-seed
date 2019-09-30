import React from 'react'
import "./row.scss"

import PropTypes from 'prop-types';
import { openFormService } from '../../../forms/form_loader/formLoaderService';

Row.propTypes = {
    id: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    fieldsNamesArr: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default function Row({ id, entity, fieldsNamesArr }) {

    const rowClicked = () => {
        openFormService.openForm(id);
    }

    return (
        <div className="row border" onClick={rowClicked}>
            {fieldsNamesArr.map((fieldName, i) => (
                <div className="col" key={i}>
                    <h6 className="field-name">{fieldName}</h6>
                    <div className="field-value">{entity[fieldName]}</div>
                </div>
            ))}
        </div>
    )
}
