import React, { useState } from 'react'
import PropTypes from 'prop-types';

import './uploader.scss';
import { Button, Snackbar, SnackbarContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Excelerator from '../Excelerator';

const fileReader = new FileReader();
const excelerator = new Excelerator();

Uploader.propTypes = {
    onFileRead: PropTypes.func.isRequired
}

export default function Uploader({ onFileRead }) {

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [fileLoaded, setFileLoaded] = useState(false);

    const readAsBinary = ([file]) => {
        if (file) {
            fileReader.readAsBinaryString(file);
        }
    };

    fileReader.onload = (e) => {
        const data = e.target.result;
        const rows = excelerator.uploadCsv(data);

        onFileRead(rows);
        setFileLoaded(true);
    };

    fileReader.onerror = (e) => {
        fileReader.abort();
        setErrorOccurred(true);
        console.error(e);
    };

    const onSnackbarClosed = () => {
        setFileLoaded(false);
        setErrorOccurred(false);
    };

    const getMessage = () => {
        if (fileLoaded) {
            return <span id="success-message">
                <CheckCircleIcon className={"icon"} />Excel file uploaded
            </span>
        }

        if (errorOccurred) {
            return <span id="error-message">
                <ErrorIcon className={"icon"} />Error occured
            </span>
        }

        return null;
    }


    return (
        <div>
            <div>
                <input className="upload-csv-btn" type='file' id="csv-input"
                    accept=".csv, .xlsx" name="file"
                    onChange={({ target }) => readAsBinary(target.files)} />
                <label htmlFor="csv-input">
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
                    message={getMessage()}
                />
            </Snackbar>
        </div>
    );
}