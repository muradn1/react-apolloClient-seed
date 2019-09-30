import React, { useEffect } from 'react'
import { saveClickedService } from '../form_loader/formLoaderService';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { TextField, Checkbox, Radio, Select } from 'final-form-material-ui';
import {
    Grid,
    Button,
    RadioGroup,
    FormLabel,
    MenuItem,
    FormGroup,
    FormControl,
    FormControlLabel,
} from '@material-ui/core';

import PropTypes from 'prop-types';

OtherForm.propTypes = {
    id: PropTypes.string,
    closeForm: PropTypes.func
}

export default function OtherForm({ id, closeForm }) {

    useEffect(() => {
        if (id) {
            console.log(id)
        }
    }, [id]);

    //this effect handles save clicked
    useEffect(() => {
        const saveClicked = () => {
            console.log("save clicked for user: ");
            closeForm();
        }

        let subscription = saveClickedService.saveClickedSub.subscribe(saveClicked)
        return () => {
            subscription.unsubscribe();
        };
    }, [closeForm])

    const validate = values => {
        const errors = {};
        if (!values.firstName) {
            errors.firstName = 'Required';
        }
        if (!values.lastName) {
            errors.lastName = 'Required';
        }
        if (!values.email) {
            errors.email = 'Required';
        }
        return errors;
    };

    const onSubmit = async values => {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(300);
        window.alert(JSON.stringify(values, 0, 2));
    };

    return (
        <div>
            <Form
                onSubmit={onSubmit}
                initialValues={{ employed: true, stooge: 'larry' }}
                mutators={{
                    ...arrayMutators
                }}
                validate={validate}
                render={({ handleSubmit, reset, submitting, form: { mutators: { push } }, pristine, values, dirtyFields }) => (
                    <form onSubmit={handleSubmit} noValidate style={{ overflowY: "scroll", overflowX: "hidden", height:"563px" }}>
                        <Grid container alignItems="flex-start" spacing={2}>

                            <Grid item xs={6}>
                                <Field
                                    fullWidth
                                    required
                                    name="firstName"
                                    component={TextField}
                                    type="text"
                                    label="First Name"
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Field
                                    fullWidth
                                    required
                                    name="lastName"
                                    component={TextField}
                                    type="text"
                                    label="Last Name"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    name="email"
                                    fullWidth
                                    required
                                    component={TextField}
                                    type="email"
                                    label="Email"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="Employed"
                                    control={
                                        <Field
                                            name="employed"
                                            component={Checkbox}
                                            type="checkbox"
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Best Stooge</FormLabel>
                                    <RadioGroup row>
                                        <FormControlLabel
                                            label="Larry"
                                            control={
                                                <Field
                                                    name="stooge"
                                                    component={Radio}
                                                    type="radio"
                                                    value="larry"
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Moe"
                                            control={
                                                <Field
                                                    name="stooge"
                                                    component={Radio}
                                                    type="radio"
                                                    value="moe"
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Curly"
                                            control={
                                                <Field
                                                    name="stooge"
                                                    component={Radio}
                                                    type="radio"
                                                    value="curly"
                                                />
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Sauces</FormLabel>
                                    <FormGroup row>
                                        <FormControlLabel
                                            label="Ketchup"
                                            control={
                                                <Field
                                                    name="sauces"
                                                    component={Checkbox}
                                                    type="checkbox"
                                                    value="ketchup"
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Mustard"
                                            control={
                                                <Field
                                                    name="sauces"
                                                    component={Checkbox}
                                                    type="checkbox"
                                                    value="mustard"
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Salsa"
                                            control={
                                                <Field
                                                    name="sauces"
                                                    component={Checkbox}
                                                    type="checkbox"
                                                    value="salsa"
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Guacamole 🥑"
                                            control={
                                                <Field
                                                    name="sauces"
                                                    component={Checkbox}
                                                    type="checkbox"
                                                    value="guacamole"
                                                />
                                            }
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    fullWidth
                                    name="notes"
                                    component={TextField}
                                    multiline
                                    label="Notes"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    fullWidth
                                    name="city"
                                    component={Select}
                                    label="Select a City"
                                    formControlProps={{ fullWidth: true }}
                                >
                                    <MenuItem value="London">London</MenuItem>
                                    <MenuItem value="Paris">Paris</MenuItem>
                                    <MenuItem value="Budapest">
                                        A city with a very long Name
                                    </MenuItem>
                                </Field>
                            </Grid>

                            <Grid item style={{ marginTop: 16 }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={reset}
                                    disabled={submitting || pristine}
                                >
                                    Reset
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <button type="button" onClick={() => push('customers', undefined)}>
                                    Add Customer
                                </button>
                            </Grid>

                            <FieldArray name="customers">
                                {({ fields: subEntites }) =>
                                    subEntites.map((subEntity, index) => (
                                        <div key={subEntity}>
                                            <label>Cust. #{index + 1}</label>
                                            <Field
                                                name={`${subEntity}.firstName`}
                                                component="input"
                                                placeholder="First Name"
                                            />
                                            <Field
                                                name={`${subEntity}.lastName`}
                                                component="input"
                                                placeholder="Last Name"
                                            />
                                            {/* eslint-disable-next-line */}
                                            <span
                                                onClick={() => subEntites.remove(index)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                ❌
                                            </span>
                                        </div>
                                    ))
                                }
                            </FieldArray>


                        </Grid>

                        <pre style={{
                            marginTop: "5px",
                            whiteSpace: "normal"
                        }}>
                            {JSON.stringify(dirtyFields)}
                            {JSON.stringify(values)}
                        </pre>
                    </form>
                )}
            />
        </div>
    )
}
