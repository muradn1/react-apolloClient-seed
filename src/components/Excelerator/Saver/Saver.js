import React from 'react';

import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';

import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

Saver.propTypes = {
    typeToCreate: PropTypes.string.isRequired,
    createQuery: PropTypes.object.isRequired,
    updateQuery: PropTypes.object.isRequired,
    getAllQuery: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

export default function Saver({ typeToCreate, createQuery, getAllQuery, data, updateQuery }) {

    const [updateMutation] = useMutation(updateQuery,
        {
            onCompleted() { console.info(`${typeToCreate} updated succesfully`) }
        });

    const [createMutation] = useMutation(createQuery, {
        onCompleted: () => { console.info(`${typeToCreate} created succesfully`) },
        update: (cache, { data: { createUser } }) => {
            try {
                const { allUsers } = cache.readQuery({ query: getAllQuery });
                cache.writeQuery({
                    query: getAllQuery,
                    data: { allUsers: allUsers.concat([createUser]) }
                })
            } catch {
                console.error(`There is no entry in cache for that item`);
            }
        }
    });

    const save = (dataFromCsv) => {
        dataFromCsv.forEach(user => {
            if (user.id) {
                updateMutation({ variables: { userInput: user } });
            } else {
                createMutation({ variables: { userInput: user } });
            }
        });
    }

    return (
        <div>
            <Button disabled={data.length === 0} variant="contained" color="primary" component="span" onClick={() => save(data)}>
                Save data in repository <SaveIcon />
            </Button>
        </div>
    )
}
