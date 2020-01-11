import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

import './uploader.scss';
/**
 * Snackbars inform users of a process that an app has performed. 
 * They appear temporarily, towards the bottom of the screen. 
 * they don’t require user input to disappear.
 */
import { Button, Snackbar, SnackbarContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExcelFileReader from '../ExcelFileReader/ExcelFileReader';
import { EntitySchemaForExcel } from '../Excelerator';

const excelFileReader = new ExcelFileReader();

Uploader.propTypes = {
    onFileLoad: PropTypes.func.isRequired,
    entitySchemaForExcel: PropTypes.instanceOf(EntitySchemaForExcel)
}

export default function Uploader({ onFileLoad, entitySchemaForExcel }) {

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [fileLoaded, setFileLoaded] = useState(false);

    useEffect(() =>{
        excelFileReader.entitySchemaForExel = entitySchemaForExcel;

    }, [entitySchemaForExcel])

    excelFileReader.onExcelFileLoad(({ dataFromExcel }) => {
        onFileLoad(dataFromExcel);
        setFileLoaded(true);
    });

    excelFileReader.onExcelFileError = (e) => {
        setErrorOccurred(true);
        console.error(e);
    }

    const onSnackbarClosed = () => {
        setFileLoaded(false);
        setErrorOccurred(false);
    };

    const getSnackbarMessage = () => {
        if (fileLoaded) {
            return <span id="success-message">
                <CheckCircleIcon className={"icon"} />Excel file uploaded
            </span>
        }
        else if (errorOccurred) {
            return <span id="error-message">
                <ErrorIcon className={"icon"} />Error occured
            </span>
        }
        else {
            return null;
        }
    }


    return (
        <div>
            <div>
                <input className="upload-excel-btn" type='file' id="excel-input"
                    accept=".csv, .xlsx" name="file"
                    onChange={({ target }) => { excelFileReader.readExcel(target.files[0]) }} />
                <label htmlFor="excel-input">
                    <Button variant="contained" color="primary" component="span">
                        Upload excel file<AddIcon />
                    </Button>
                </label>
            </div>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={errorOccurred || fileLoaded}
                autoHideDuration={2000}
                onClose={onSnackbarClosed}>
                <SnackbarContent className={fileLoaded ? "success-snackbar" : "error-snackbar"}
                    message={getSnackbarMessage()}
                />
            </Snackbar>
        </div>
    );
}