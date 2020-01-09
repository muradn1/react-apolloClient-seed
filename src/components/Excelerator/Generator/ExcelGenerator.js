import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useLazyQuery } from "@apollo/react-hooks";
import {
    Button,
    SnackbarContent,
    Snackbar
} from "@material-ui/core";

import './excel-generator.scss';

import ProgressBar from '../../Progress/ProgressBar';

import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@material-ui/icons/GetApp';

import { createAndDownloadExcelWithData } from '../Excelerator';
import { GET_TYPE } from "../../../graphql/SchemaGql";

ExcelGenerator.propTypes = {
    getAllDataQuery: PropTypes.object.isRequired,
    typeName: PropTypes.string.isRequired
}

export default function ExcelGenerator({ getAllDataQuery, typeName }) {

    const [getAllData, { error, loading, data }] = useLazyQuery(getAllDataQuery);
    const [getType, { error: getTypeError, loading: getTypeLoading, data: schemaTypeToGenerate }] = useLazyQuery(GET_TYPE);
    // const [dataLoaded, setDataLoaded] = useState(false);
    const [resultMessage, setResultMessage] = useState(null);

    useEffect(() => {
        if (data) {
            const keys = _.keys(data);
            // if (keys.length > 0) {
            if (keys.length === 0) {
                const key = keys[0];
                const dataArr = data[key];
                createAndDownloadExcelWithData({ fileName: `${typeName}-data`, data: dataArr, typeName });
                // setDataLoaded(true);
                setResultMessage(`Excel file of type ${typeName} downloaded successfully`);
            } else {
                getType({variables: {typeName}})
            }

        }
    }, [data, getType, typeName])

    useEffect(() => {
        if (schemaTypeToGenerate) {
            createAndDownloadExcelWithData({ fileName: `${typeName}-data`, schema: schemaTypeToGenerate , typeName });
        }
    }, [schemaTypeToGenerate, getType, typeName])

    if (error) {
        console.error(error);

        return <div className="snackbar-container">
            <SnackbarContent
                className="error-snackbar"
                message={
                    <span className="client-snackbar">
                        <ErrorIcon /> Unable to generate excel file, error loading GQL types
                    </span>
                }
            />
        </div>
    }

    if (loading || getTypeLoading) {
        return <ProgressBar />;
    }

    return (
        <div className="excel-generator">
            <div className="excel-generator-container">
                <div className="generate-excel-btn">
                    <Button onClick={getAllData} variant="contained" color="primary">
                        Generate excel file for {typeName} <GetAppIcon />
                    </Button>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                // open={dataLoaded}
                open={ resultMessage !== null }
                autoHideDuration={2000}
                // onClose={() => setDataLoaded(false)}>
                onClose={() => setResultMessage(null)}>
                <SnackbarContent className={"success-snackbar"}
                    message={resultMessage}
                />
            </Snackbar>
        </div>
    );
}