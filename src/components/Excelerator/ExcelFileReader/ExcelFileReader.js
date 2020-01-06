import { loadDataFromExcelFile } from "../Excelerator";

export default class ExcelFileReader {

    constructor() {
        this.fileReader = new FileReader();
    }

    readExcel(file) {
        if(file) {
            this.fileReader.readAsBinaryString(file);
        }
    }

    onExcelFileLoad(callback) {
        this.fileReader.onload = (e) => {
            const data = e.target.result;
            const rows = loadDataFromExcelFile(data);

            callback({rows, e});
        };
    }

    onExcelFileError(callback) {
        this.fileReader.onerror = (e) => {
            this.fileReader.abort();
            callback(e);
        }
    }
}


