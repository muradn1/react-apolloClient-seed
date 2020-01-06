import { loadDataFromCsv } from "../Excelerator";

export default class CsvFileReader {

    constructor() {
        this.fileReader = new FileReader();
    }

    readCsv(file) {
        if(file) {
            this.fileReader.readAsBinaryString(file);
        }
    }

    onCsvFileLoad(callback) {
        this.fileReader.onload = (e) => {
            const data = e.target.result;
            const rows = loadDataFromCsv(data);

            callback({rows, e});
        };
    }

    onCsvFileError(callback) {
        this.fileReader.onerror = (e) => {
            this.fileReader.abort();
            callback(e);
        }
    }
}


