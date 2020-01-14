import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useLazyQuery } from "@apollo/react-hooks";
import {
    Button,
    SnackbarContent,
    Snackbar
} from "@material-ui/core";

import './generator-and-downloader.scss';
import ProgressBar from '../../Progress/ProgressBar';
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@material-ui/icons/GetApp';
import { EntitySchemaForExcel, generateAndDownloadExcelFile } from '../Excelerator';

GeneratorAndDownloader.propTypes = {
    getAllDataQuery: PropTypes.object.isRequired,
    getAllDataQueryName: PropTypes.string.isRequired,
    entitySchemaForExcel: PropTypes.instanceOf(EntitySchemaForExcel)
}

export default function GeneratorAndDownloader({ getAllDataQuery, getAllDataQueryName, entitySchemaForExcel }) {

    const [getAllData, { error: getAllDataError, loading, data: allDataFromGQL }] = useLazyQuery(getAllDataQuery);
    const [resultMessage, setResultMessage] = useState(null);

    const activate = () => {
        getAllData();
    }

    useEffect(() => {
        if (allDataFromGQL && getAllDataQueryName) {
            let allData = allDataFromGQL[getAllDataQueryName];
            generateAndDownloadExcelFile(`${entitySchemaForExcel.entityName}s-data`, entitySchemaForExcel, allData);
        }
    }, [allDataFromGQL, getAllDataQueryName, entitySchemaForExcel]);



    if (getAllDataError) {
        console.error(getAllDataError);

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

    if (loading) {
        return <ProgressBar />;
    }

    return (
        <div className="excel-generator-and-downloader">
            <Button onClick={activate} variant="contained" color="primary">
                Generate excel file for {entitySchemaForExcel.entityName} <GetAppIcon />
            </Button>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={resultMessage !== null}
                autoHideDuration={2000}
                onClose={() => setResultMessage(null)}>
                <SnackbarContent className={"success-snackbar"}
                    message={resultMessage}
                />
            </Snackbar>
        </div>
    );
}