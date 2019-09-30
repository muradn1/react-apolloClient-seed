import React, { useState } from 'react'
import "./list.scss"
import PropTypes from 'prop-types';
import Row from './row/Row';
import FieldsFilter from './fields_filter/FieldsFilter';

List.propTypes = {
    entitiesArr: PropTypes.array.isRequired,
    fieldsNamesArr: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired
}

export default function List({ entitiesArr, fieldsNamesArr, image }) {
    const [filteredFields, setFilteredFields] = useState(fieldsNamesArr.slice(0,7));
    
    const filteredFieldsChange = (newFields) => {
        setFilteredFields(newFields);
    }

    return (
        <div className="list">
            <div className="rows">
                {
                    entitiesArr.map(entity => (
                        <Row
                            key={entity.id}
                            id={entity.id}
                            entity={entity}
                            fieldsNamesArr={filteredFields}
                        />
                    ))
                }
            </div>
            <div className="filter">
                <div className="image">
                    <img src={image} alt="..." />
                </div>
                <FieldsFilter allFields={fieldsNamesArr}  onChange={filteredFieldsChange}/>
            </div>
        </div>
    )
}

