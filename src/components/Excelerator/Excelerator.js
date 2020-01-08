import XLSX from "xlsx";
import _ from "lodash";

/**
 * 
 * @param {*} excel Binary representation of an excel file. Could be acquired using js FileReader
 * @returns Representation of the data in the excel file. 
 * For example: data = [{
            id: 1,
            firstName: "Jane",
            lastName: "Doe",
            children:[{id:3, name:"Bob"},{id:4, name:"John"}],
            certifications: ["java","js"]
        },
        {
            id:2,
            firstName: "John",
            lastName: "Doe",
            children:[{id:5, name:"Bob"},{id:6, name:"John"}],
            certifications: ["java","js"]
        }
    ]
 */
export function loadDataFromExcelFile(excel) {
    const workbook = XLSX.read(excel, {
        type: 'binary'
    });

    const [mainType, ...listsNames] = workbook.SheetNames;

    const data = XLSX.utils.sheet_to_json(workbook.Sheets[mainType]);

    if (listsNames) {
        addListsToMainTypeObject(data, listsNames, workbook);
    }

    return data;
}

/**
 * 
 * @param {*} mainData The main type. For example: "User"
 * @param {*} listNames The names of the lists connected to the main type. For example: ["Children", "Certifications"]
 * @param {*} workbook The workbook in which the data is saved. First sheet is the main type and the rest are the lists
 * @description Addsd the list data to the main type
 */
function addListsToMainTypeObject(mainData, listNames, workbook) {
    listNames.forEach(name => {
        /**
         * listData = {
         *  "children": [{id:5, name:"Bob", parentId: 1},{id:6, name:"John", parentId: 1}],
         *  "certifications": ["java","js"]
         * }
         */
        const listData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
        const dataGroupedByParentId = _.groupBy(listData, x => x.parentId);

        _.keys(dataGroupedByParentId).forEach(parentId => {
            const parent = mainData.find(entry => entry.id === parentId);

            if (!parent) {
                throw new Error(`Parent with id ${parentId} cannot be null`);
            }

            parent[name] = dataGroupedByParentId[parentId]
        });
    });
}

/**
 * Creates an excel file of type .xlsx
 * @param {*} fileName The name of the file to be created
 * @param {*} data the data to be saved in the excel file. 
 * For example: data = [{
            id: 1,
            firstName: "Jane",
            lastName: "Doe",
            children:[{id:3, name:"Bob"},{id:4, name:"John"}],
            certifications: ["java","js"]
        },
        {
            id:2,
            firstName: "John",
            lastName: "Doe",
            children:[{id:5, name:"Bob"},{id:6, name:"John"}],
            certifications: ["java","js"]
        }
    ]
 * @param {*} typeName The name of the main type. For example: User
 */
export function createAndDownloadExcelWithData(fileName, data, typeName) {
    const newWorkbook = XLSX.utils.book_new();
    const entry = data[0];
    const listNames = _.keys(entry).filter(key => Array.isArray(entry[key]));

    if (listNames) {

        const lists = listNames.reduce((listObj, name) => {
            listObj[name] = data.flatMap(entry => {
                const currentList = entry[name];

                currentList.forEach(listItem => listItem.parentId = entry.id);

                return currentList;
            });

            return listObj;
        }, {})

        addSheetToWorkbook(typeName, newWorkbook, data);

        _.keys(lists).forEach(listName => {
            addSheetToWorkbook(listName, newWorkbook, lists[listName]);
        });
    }

    downloadExcelFile(newWorkbook, fileName)
}

/**
 * Adds a new sheet to a workbook with data
 * @param {*} sheetName The name of the sheet to add
 * @param {*} workbook A workbook created via XLSX.utils.book_new()
 * @param {*} data The data saved in the sheet
 */
function addSheetToWorkbook(sheetName, workbook, data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}

function downloadExcelFile(workbook, fileName) {
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}