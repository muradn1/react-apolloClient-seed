import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { useMutation, useLazyQuery } from '@apollo/react-hooks';

import { Button, Snackbar, SnackbarContent } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { EntitySchemaForExcel } from '../Excelerator';

Saver.propTypes = {
    syncMutation: PropTypes.object.isRequired,
    getAllQuery: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    closePopup: PropTypes.func.isRequired,
    entitySchemaForExcel: PropTypes.instanceOf(EntitySchemaForExcel),
    syncMutationVariables: PropTypes.shape({
        variables: PropTypes.any.isRequired
    })
};

export default function Saver({ syncMutation, syncMutationVariables, getAllQuery, entitySchemaForExcel, isDisabled, closePopup }) {

    const [getAll] = useLazyQuery(getAllQuery);
    const [snackBarMassage, setSnackBarMassage] = useState();

    const [callSyncMutation] = useMutation(syncMutation, {
        onCompleted: () => {
            getAll();
            setSnackBarMassage(`${entitySchemaForExcel.entityName}s saved successfully`);
        }
    });


    const save = () => {
        callSyncMutation(syncMutationVariables);
    }

    return (
        <div>
            <Button disabled={isDisabled} variant="contained" color="primary" component="span" onClick={() => save()}>
                Save data in repository <SaveIcon />
            </Button>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackBarMassage}
                autoHideDuration={3000}
                onClose={() => closePopup()}>
                <SnackbarContent className={"success-snackbar"}
                    message={snackBarMassage}
                />
            </Snackbar>
        </div>
    )
}
