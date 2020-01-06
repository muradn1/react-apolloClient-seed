import XLSX from "xlsx";
import _ from "lodash";

export function getCsvHeader(fields) {
    const listNamesInGqlObject = getListNamesOfGqlObject(fields);

    const listObjects = fields.filter(({ name }) => listNamesInGqlObject.includes(name));
    const nonListObjects = fields.filter(({ name }) => !listNamesInGqlObject.includes(name));

    // Create 3 columns for each list object
    const objectCsvData = listObjects.map(({ name }) => {
        return [1, 2, 3].map(i => ({ [`${name}${i}`]: {} }));
    });

    const nonObjectCsvData = nonListObjects.map(({ name }) => ({ [name]: {} }));

    return [...nonObjectCsvData, ...objectCsvData.flat()];
}

export function createCsv(fileName, data) {
    const newWorkbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, worksheet);

    XLSX.writeFile(newWorkbook, `${fileName}.csv`);
}

export function loadDataFromCsv(csv) {
    const workbook = XLSX.read(csv, {
        type: 'binary'
    });

    const firstSheetName = workbook.SheetNames[0];
    const csvRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

    return csvRows;
}

function getListNamesOfGqlObject(gqlObjectFields) {
    return gqlObjectFields
        .filter(({ type }) => type.kind === "LIST")
        .map(({ name }) => name);
}

export function downloadCsvWithData(fileName, data, typeName) {
    const newWorkbook = XLSX.utils.book_new();
    const entry = data[0];
    const listNames = _.keys(entry).filter(key => Array.isArray(entry[key]));

    const lists = {};

    listNames.forEach(name => {
        lists[name] = data.flatMap(entry => entry[name]);
    });

    addSheetToWorkbook(typeName, newWorkbook, data);

    _.keys(lists).forEach(listName => {
        addSheetToWorkbook(listName, newWorkbook, lists[listName]);
    });

    XLSX.writeFile(newWorkbook, `${fileName}.xlsx`);
}

export function loadCsv(csv) {
    const workbook = XLSX.read(csv, {
        type: "binary"
    });

    const firstSheetName = workbook.SheetNames[0];
    const csvRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

    return csvRows;
}

function addSheetToWorkbook(sheetName, workbook, data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}