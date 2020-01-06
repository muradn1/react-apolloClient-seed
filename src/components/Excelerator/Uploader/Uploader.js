import React, { useState } from 'react'
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

const excelFileReader = new ExcelFileReader();

Uploader.propTypes = {
    onFileRead: PropTypes.func.isRequired
}

export default function Uploader({ onFileRead }) {

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [fileLoaded, setFileLoaded] = useState(false);

    excelFileReader.onExcelFileLoad(({ rows }) => {
        onFileRead(rows);
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
                <input className="upload-excel-btn" type='file'
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