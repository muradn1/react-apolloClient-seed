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

ExcelGenerator.propTypes = {
    getAllDataQuery: PropTypes.object.isRequired,
    typeName: PropTypes.string.isRequired
}

export default function ExcelGenerator({ getAllDataQuery, typeName }) {

    const [getAllData, { error, loading, data }] = useLazyQuery(getAllDataQuery);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (data) {
            const key = _.keys(data)[0];
            const dataArr = data[key];

            createAndDownloadExcelWithData(`${typeName}-data`, dataArr, typeName);

            setDataLoaded(true);
        }
    }, [data, typeName])

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

    if (loading) {
        return <ProgressBar />;
    }

    return (
        <div className="excel-generator">
            <div className="excel-generator-container">
                <div className="generate-excel-btn">
                    <Button onClick={getAllData} variant="contained" color="primary">
                        Generate excel file for {typeName} <GetAppIcon/>
                    </Button>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={dataLoaded}
                autoHideDuration={2000}
                onClose={() => setDataLoaded(false)}>
                <SnackbarContent className={"success-snackbar"}
                    message={`Excel file for type ${typeName} was generated succesfully`}
                />
            </Snackbar>
        </div>
    );
}