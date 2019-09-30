import React, { useState } from 'react'
import PropTypes from 'prop-types';
import "./fieldsFilter.scss"

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

FieldsFilter.propTypes = {
    allFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
}

export default function FieldsFilter({ allFields, onChange }) {
    const [chosenFields, setChosenFields] = useState(allFields.slice(0, 7));

    const error = chosenFields.length > 7;

    if (!error) {
        onChange(chosenFields)
    }

    const handleChange = (e) => {

        if (e.target.checked) {
            setChosenFields([...chosenFields, e.target.value]);
        } else {
            setChosenFields(chosenFields.filter(fieldName => fieldName !== e.target.value))
        }
    }

    return (
        <div className="fields-filter">
            <FormControl required error={error} component="fieldset" >
                <div className="main-label">
                    <FormLabel  className={"main-label"} component="legend">תבחר/י עד 7 שדות</FormLabel>
                </div>
                <FormGroup className="fields">
                    {
                        allFields.map(fieldName => (
                            <FormControlLabel key={fieldName}
                                label={fieldName}
                                control={
                                    <Checkbox
                                        checked={chosenFields.indexOf(fieldName) !== -1}
                                        value={fieldName}
                                        onChange={handleChange}
                                    />
                                }
                            />
                        ))
                    }
                </FormGroup>
            </FormControl>


        </div>
    )
}
