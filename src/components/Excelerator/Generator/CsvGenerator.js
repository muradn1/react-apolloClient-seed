import React, { useEffect, useState, useCallback } from 'react';
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
    const [gqlTypes, setGqlTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [firstFetch, setFirstFetch] = useState(true);

    useEffect(() => {
        getType({ variables: { typeName: selectedType.name } });
    }, [getType, selectedType])

    const downloadExcelFile = useCallback(
        () => {
            if (typeToGenerate && typeToGenerate.__type) {
                const { name, inputFields } = typeToGenerate.__type;

                const header = excelerator.getCsvHeader(inputFields);

                excelerator.downloadCsv(header, name);
            }
        }, [typeToGenerate],
    )

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

    if (data && data.__schema && firstFetch) {
        const { types } = data.__schema;

        const typesToShow = types.filter(type =>
            !type.name.startsWith('__') &&
            !unwantedGqlTypes.includes(type.name) &&
            type.kind === 'INPUT_OBJECT');

        setGqlTypes(typesToShow);
        setSelectedType(typesToShow[0]);
        setFirstFetch(false);
    }

    return (
        <div id="csv-generator">
            <div id="csv-generator-container">
                <div id="types-selector">
                    <FormControl style={{ minWidth: '180px' }}>
                        <InputLabel id="gql-type">Type</InputLabel>
                        <Select
                            id="gql-type-select"
                            value={selectedType}
                            onChange={({ target }) => setSelectedType(target.value)}
                        >
                            {gqlTypes.map(type => <MenuItem key={type.name} value={type}>{type.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div id="choose-type-btn">
                    <Button onClick={downloadExcelFile} variant="outlined" color="primary">
                        Generate excel file
                    </Button>
                </div>
            </div>
        </div>
    );
}