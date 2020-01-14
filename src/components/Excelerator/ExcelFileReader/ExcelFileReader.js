import { loadDataFromExcelFile } from "../Excelerator";

export default class ExcelFileReader {
  constructor(entitySchemaForExel) {
    this.fileReader = new FileReader();
    this.entitySchemaForExel = entitySchemaForExel;
  }

  readExcel(file) {
    if (file) {
      this.fileReader.readAsBinaryString(file);
    }
  }

  onExcelFileLoad(callback) {
    this.fileReader.onload = e => {
      const data = e.target.result;
      const dataFromExcel = loadDataFromExcelFile(
        Object.freeze(this.entitySchemaForExel),
        data
      );

      callback({ dataFromExcel, e });
    };
  }

  onExcelFileError(callback) {
    this.fileReader.onerror = e => {
      this.fileReader.abort();
      callback(e);
    };
  }
}
