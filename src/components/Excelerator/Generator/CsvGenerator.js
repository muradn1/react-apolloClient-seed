import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { GET_TYPE, GET_ALL_TYPES } from '../../../graphql/SchemaGql';
import { FormControl, InputLabel, Select, MenuItem, Button, SnackbarContent } from '@material-ui/core';

import './csv-generator.scss';
import ProgressBar from '../../Progress/ProgressBar';
import Excelerator from '../Excelerator';
import ErrorIcon from '@material-ui/icons/Error';

const excelerator = new Excelerator();
const unwantedGqlTypes = ['Query', 'Mutation', "Subscription"];

export default function CsvGenerator() {

    const { loading, data, error } = useQuery(GET_ALL_TYPES);
    const [getType, { loading: typeLoading, data: typeToGenerate }] = useLazyQuery(GET_TYPE);
    const [inputObjects, setInputObjects] = useState([]);
    const [selectedInputObject, setSelectedInputObject] = useState('');

    useEffect(() => {
        if (data) {
            const inputObjectsInSchema = getInputObjects(data.__schema);

            setInputObjects(inputObjectsInSchema);
            setSelectedInputObject(inputObjectsInSchema[0]);
        }
    }, [data])

    useEffect(() => {
        if (selectedInputObject) {
            getType({ variables: { typeName: selectedInputObject.name } });
        }
    }, [getType, selectedInputObject])

    const generateExcelFile = () => {
        if (typeToGenerate && typeToGenerate.__type) {
            const { name, inputFields } = typeToGenerate.__type;

            const header = excelerator.getCsvHeader(inputFields);

            excelerator.downloadCsv(name, header);
        }
    };

    if (error) {
        return <div className="snackbar-container">
            <SnackbarContent
                className="error-snackbar"
                message={
                    <span id="client-snackbar">
                        <ErrorIcon /> Unable to generate excel file, error loading GQL types
                    </span>
                }
            />
        </div>
    }

    if (loading || typeLoading) {
        return <ProgressBar />
    }

    return (
        <div className="csv-generator">
            <div className="csv-generator-container">
                <div className="types-selector">
                    <FormControl style={{ minWidth: '180px' }}>
                        <InputLabel id="gql-type">Type</InputLabel>
                        <Select
                            id="gql-type-select"
                            value={selectedInputObject}
                            onChange={({ target }) => setSelectedInputObject(target.value)}
                        >
                            {inputObjects.map(type => <MenuItem key={type.name} value={type}>{type.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                
                <div id="choose-type-btn">
                    <Button onClick={generateExcelFile} variant="outlined" color="primary">
                        Generate excel file
                    </Button>
                </div>
            </div>
        </div>
    );
}

function getInputObjects(gqlSchema) {
    const { types } = gqlSchema;

    return types.filter(type =>
        !type.name.startsWith('__') &&
        !unwantedGqlTypes.includes(type.name) &&
        type.kind === 'INPUT_OBJECT');
}