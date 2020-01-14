import React, { useEffect, useState } from 'react'
import { deleteClickedService } from '../form_loader/formLoaderService';

import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { USER_BY_ID_QUERY, User, UPDATE_USER, CREATE_USER, GET_All_USERS, DELETE_USER } from "../../../graphql/UserGql.js"

import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { TextField } from 'final-form-material-ui';
import { Grid } from '@material-ui/core';

import FormWrapper from '../form_wrapper/FormWrapper';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import "./userForm.scss"
import PropTypes from 'prop-types';
import { numberParse } from '../form_wrapper/parserService';
import { getOnlyDirtyFields } from '../../../utils/dirtyFieldsUtils';

UserForm.propTypes = {
    id: PropTypes.string,
    closeForm: PropTypes.func
}

export default function UserForm({ id, closeForm }) {
    const [getUserById, { loading, data }] = useLazyQuery(USER_BY_ID_QUERY);
    const [updateUserMutation] = useMutation(UPDATE_USER, { onCompleted() { closeForm() } });
    const [createUserMutation] = useMutation(CREATE_USER, {
        onCompleted: () => { closeForm() },
        update: (cache, { data: { createUser } }) => {
            const { allUsers } = cache.readQuery({ query: GET_All_USERS });
            cache.writeQuery({
                query: GET_All_USERS,
                data: { allUsers: allUsers.concat([createUser]) }
            })
        }
    });

    const [deleteUserMutation] = useMutation(DELETE_USER, {
        onCompleted: () => { closeForm() },
        update: (cache, { data: { id } }) => {
            let typename = "";
            const { allUsers } = cache.readQuery({ query: GET_All_USERS });

            cache.writeQuery({
                query: GET_All_USERS,
                data: {
                    allUsers: allUsers.filter(user => {
                        typename = user.__typename;
                        return user.id !== id;
                    })
                }
            })

            cache.data.delete(typename + ":" + id);
        }
    });

    const [state, setstate] = useState(new User({}));
    const [firstFetch, setFirstFetch] = useState(true);

    useEffect(() => {
        if (id) {
            getUserById({ variables: { id: id } });
        }
    }, [id, getUserById]);


    //this effect handles "delete" clicked
    useEffect(() => {
        const deleteClicked = () => {
            deleteUserMutation({ variables: { id: id } });
        }

        let subscription = deleteClickedService.deleteClickedSub.subscribe(deleteClicked)
        return () => {
            subscription.unsubscribe();
        };
    }, [id, deleteUserMutation])

    if (loading) {
        return <p>loading...</p>
    }

    if (data && data.User && firstFetch) {
        const user = new User(data.User);
        setstate(user);

        setFirstFetch(false);
    }

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


    const onSubmit = ({ values, dirtyFields }) => {
        const userToSend =  getOnlyDirtyFields({ subEntitesFieldName: "children", values, dirtyFields });
        if (id) {
            updateUser(userToSend);
        } else {
            createUser(userToSend);
        }
    };

    const updateUser = (userToUpdate) => {
        updateUserMutation({ variables: { user: userToUpdate } });
    }

    const createUser = (userToCreate) => {
        createUserMutation({ variables: { user: userToCreate } });
    }

    return (
        <FormWrapper
            initialValues={state}
            validate={validate}
            onSubmit={onSubmit}
            formBody={FormBody}
        />
    )
}


const FormBody = ({ push }) => (
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
                disabled={false}
                type="email"
                label="Email"
            />
        </Grid>

        <Grid item xs={12}>
            <div className="children-header">
                {/* eslint-disable-next-line */}
                <h6 className="horizontal-line"></h6>
                <span className="label" > children </span>
                {/* eslint-disable-next-line */}
                <h6 className="horizontal-line"></h6>
                <AddBoxOutlinedIcon className="add-icon" onClick={() => push('children', undefined)} />

            </div>
        </Grid>

        <Grid container item xs={12}>
            <FieldArray name="children">
                {({ fields: subEntites }) =>
                    subEntites.map((subEntity, index) => (
                        <Grid key={subEntity} container item xs={12} spacing={2} >
                            <Grid item xs={5}>
                                <Field
                                    name={`${subEntity}.name`}
                                    fullWidth
                                    required
                                    component={TextField}
                                    type="text"
                                    label="name"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <Field
                                    name={`${subEntity}.age`}
                                    fullWidth
                                    component={TextField}
                                    type="number"
                                    parse={numberParse}
                                    label="age"
                                />
                            </Grid>
                            <Grid item xs={2} style={{display:"flex", alignItems:"flex-end"}}>
                                <span role="img" aria-label="..." onClick={() => subEntites.remove(index)} style={{ cursor: 'pointer' }}>❌</span>
                            </Grid>


                        </Grid>
                    ))
                }
            </FieldArray>
        </Grid>

    </Grid>
);

FormBody.propTypes = {
    push: PropTypes.func
}

