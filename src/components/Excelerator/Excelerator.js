import XLSX from "xlsx";
import _ from "lodash";

/**
 * 
 * @param {*} excel Binary representation of an excel file. Could be acquired using js FileReader
 * @returns Representation of the data in the excel file. 
 * For example: data = [{
            id: 1,
            firstName: "Jane",
            children:[{id:3, name:"Bob"},{id:4, name:"John"}],
            certifications: ["java","js"]
        },
        {
            id:2,
            firstName: "John",
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
 * @param {*} workbook The workbook in which the data is saved. First sheet is the main type and the rest are the lists. Can be acquired using XLSX.utils.book_new()
 * @description Addsd the list data to the main type
 */
function addListsToMainTypeObject(mainData, listNames, workbook) {
    listNames.forEach(name => {
        // listData = [{id:5, name:"Bob", parentId: 1},{id:6, name:"John", parentId: 1}]
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
            children:[{id:3, name:"Bob"},{id:4, name:"John"}],
            certifications: ["java","js"]
        },
        {
            id:2,
            firstName: "John",
            children:[{id:5, name:"Bob"},{id:6, name:"John"}],
            certifications: ["java","js"]
        }
    ]
 * @param {*} typeName The name of the main type. For example: User
 */
export function createAndDownloadExcelWithData({ fileName, data, typeName, schema }) {
    const newWorkbook = XLSX.utils.book_new();

    if (data) {
        createExcelFileWithData(data, typeName, newWorkbook);
    } else if (schema) {
        createExcelFileFromSchema(schema, typeName, newWorkbook);
    } else {
        throw new Error('In order to generate excel file data or schema must be given');
    }

    // Writes the file and downloads it
    XLSX.writeFile(newWorkbook, `${fileName}.xlsx`);
}

function createExcelFileFromSchema(schema, typeName, newWorkbook) {
    const { fields } = schema.__type;
    const excelFields = getExcelFields(fields);
    addSheetToWorkbook(typeName, newWorkbook, [excelFields]);
    _.keys(excelFields.lists).forEach(listName => {
        const currentListData = [excelFields.lists[listName]];
        addSheetToWorkbook(listName, newWorkbook, currentListData);
    });
}

function getExcelFields(fields) {
    const excelFields = fields.reduce((excelFields, { name, type }) => {

        if (type.kind !== 'LIST') {
            excelFields[name] = {};
        } else {
            const { fields: listFields } = type.ofType;

            const currentListFields = listFields.reduce((currentListFields, { name }) => {
                currentListFields[name] = {};

                return currentListFields;
            }, {})

            excelFields.lists[name] = currentListFields;
        }

        return excelFields;
    }, { lists: {} });

    return excelFields;
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

function createExcelFileWithData(data, typeName, workbookToCreate) {
    const entry = data[0];
    const listNames = _.keys(entry).filter(key => Array.isArray(entry[key]));

    if (listNames) {
        const lists = getListsInGqlType(listNames, data);

        addSheetToWorkbook(typeName, workbookToCreate, data);

        _.keys(lists).forEach(listName => {
            addSheetToWorkbook(listName, workbookToCreate, lists[listName]);
        });
    }
}

function getListsInGqlType(listNames, gqlData) {
    const lists = listNames.reduce((listObj, name) => {
        listObj[name] = gqlData.flatMap(entry => {
            const currentList = entry[name];

            currentList.forEach(listItem => listItem.parentId = entry.id);

            // currentList = [{id:3, name:"Bob", parentId = "1"},{id:4, name:"John", parentId = "1"}]
            return currentList;
        });

        return listObj;
    }, {})

    return lists;
}