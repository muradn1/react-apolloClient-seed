import XLSX from "xlsx";

export class EntitySchemaForExcel {
  entityName; //"User"
  scalarFields = []; //["firstName","lastName",...]
  embeddedObjsNames = []; //["address",...]
  scalarListsNames = []; //["certifications",...]
  objsListsNames = []; //["children",...]

  /**
   * here comes the  fields of embeddedObjs in shape of:
   * ["embeddedObjName"] : EntitySchemaForExcel 
   * 
   * example : 
   * address:{
   * scalarFields:["city, address, ..."]
   * }
   */

  /**
 * here comes the  fields of ListsObjs in shape of:
 * ["objsListName"] : EntitySchemaForExcel
 *
 * example : 
 * children:{
 * scalarFields:["name, age, ..."]
 * }
 */
}


/**
 * 
 * @param {*} excel Binary representation of an excel file. Could be acquired using js FileReader
 * @returns Representation of the data in the excel file. 
 * For example: result data = [{
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
export function loadDataFromExcelFile(entitySchema, excel) {
  const workbook = XLSX.read(excel, { type: "binary" });

  const [mainSheetName, ...listsNames] = workbook.SheetNames;

  const mainSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[mainSheetName]);
  //example: array of users
  const mainEntitiesArr = loadMainSheetData(entitySchema, mainSheetData);

  listsNames.forEach(ln => {
    let listSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[ln]);
    if (entitySchema.scalarListsNames.includes(ln)) {
      addScalarListToMainEntitiesArr(mainEntitiesArr, entitySchema, ln, listSheetData);
    } else {
      addObjListToMainEntitiesArr(mainEntitiesArr, entitySchema, ln, listSheetData);
    }
  })

  return mainEntitiesArr;
}

function loadMainSheetData(entitySchema, sheetData) {
  const mainEntitiesArr = sheetData.map(entryDataFromExcel => {
    let entry = {};

    entitySchema.scalarFields.forEach(sf => {
      entry[`${sf}`] = entryDataFromExcel[`${sf}`]
    });

    entitySchema.embeddedObjsNames.forEach(eon => {
      entry[`${eon}`] = {};

      entitySchema[`${eon}`].scalarFields.forEach(eosf => {
        entry[`${eon}`][`${eosf}`] = entryDataFromExcel[`${eon}.${eosf}`];
      })
    })

    return entry;
  })

  return mainEntitiesArr;

}

function addScalarListToMainEntitiesArr(mainEntitiesArr, entitySchema, listName, listSheetData) {
  mainEntitiesArr.forEach(me => {
    me[`${listName}`] = [];

    listSheetData.forEach(lsde => {
      if (lsde[`${entitySchema.entityName}Id`] === me.id){
        me[`${listName}`].push(lsde[`${listName.replace(/s$/,"")}`]);
      }
    });
  });
}

function addObjListToMainEntitiesArr(mainEntitiesArr, entitySchema, listName, listSheetData) {
  mainEntitiesArr.forEach(me => {
    me[`${listName}`] = [];

    listSheetData.forEach(lsde => {
      if (lsde[`${entitySchema.entityName}Id`] === me.id){
        let listObj = {};

        entitySchema[`${listName}`].scalarFields.forEach(olsf => {
          listObj[`${olsf}`] = lsde[`${olsf}`];
        })
        me[`${listName}`].push(listObj);
      }
    });
  });
}


/**
 * @param {*} fileName The name of the file to be created
 * @param {*} entitySchema is instanse of EntitySchemaForExcel
 * @param {*} allData  to be saved in the excel file.
 * For example: allData = [{
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
export function generateAndDownloadExcelFile(fileName, entitySchema, allData) {

  const newWorkbook = XLSX.utils.book_new();
  let dataForMainSheet = [];


  //generate main sheet

  if (allData && allData.length > 0) {
    dataForMainSheet = allData.map(entryData => {
      return generateEntryForMainSheet(entitySchema, entryData);
    })
  } else {
    //if there's no data then only generates the header.
    dataForMainSheet[0] = generateEntryForMainSheet(entitySchema);
  }

  addSheetToWorkbook(entitySchema.entityName, newWorkbook, dataForMainSheet);


  //generate sheets for scalarLists

  entitySchema.scalarListsNames.forEach(sln => {
    let dataForScalarListSheet = [];

    if (allData && allData.length > 0) {
      dataForScalarListSheet = allData.flatMap(entryData => {
        return generateEntriesForScalarListSheet(entitySchema, sln, entryData);
      })
    } else {
      //if there's no data then only generates the header.
      dataForScalarListSheet = generateEntriesForScalarListSheet(entitySchema, sln);
    }

    addSheetToWorkbook(sln, newWorkbook, dataForScalarListSheet);
  })


  //generate sheets for objLists

  entitySchema.objsListsNames.forEach(oln => {
    let dataForObjListSheet = [];

    if (allData && allData.length > 0) {
      dataForObjListSheet = allData.flatMap(entryData => {
        return generateEntriesForObjListSheet(entitySchema, oln, entryData);
      })
    } else {
      //if there's no data then only generates the header.
      dataForObjListSheet = generateEntriesForObjListSheet(entitySchema, oln);
    }

    addSheetToWorkbook(oln, newWorkbook, dataForObjListSheet);

  })

  // writes the file and downloads it
  XLSX.writeFile(newWorkbook, `${fileName}.xlsx`);
}

function generateEntryForMainSheet(entitySchema, entryData = {}) {
  let entryForSheet = entitySchema.scalarFields.reduce((header, sf) => {
    header[sf] = entryData[sf];

    return header;
  }, {});

  entryForSheet = entitySchema.embeddedObjsNames.reduce((header, eon) => {
    entitySchema[eon].scalarFields.forEach(embeddedScalarFieldName => {
      header[`${eon}.${embeddedScalarFieldName}`] = entryData[`${eon}`] ? entryData[`${eon}`][`${embeddedScalarFieldName}`] : undefined;
    })

    return header;
  }, entryForSheet);

  return entryForSheet;
}

function generateEntriesForScalarListSheet(entitySchema, scalarListName, mainEntityEntry = {}) {


  let entriesForSheet = [];

  if (mainEntityEntry[`${scalarListName}`]) {
    entriesForSheet = mainEntityEntry[`${scalarListName}`].map((slEntry) =>
      generateSingleEntryForScalarListSheet(entitySchema, scalarListName, mainEntityEntry, slEntry));

  } else {
    entriesForSheet[0] = generateSingleEntryForScalarListSheet(entitySchema, scalarListName);
  }

  return entriesForSheet;
}

function generateSingleEntryForScalarListSheet(entitySchema, scalarListName, mainEntityData = {}, scalarListEntry) {
  let slEntryForSheet = {};

  slEntryForSheet[`${entitySchema.entityName}Id`] = mainEntityData.id;
  slEntryForSheet[`${scalarListName.replace(/s$/, "")}`] = scalarListEntry;

  return slEntryForSheet;
}

function generateEntriesForObjListSheet(entitySchema, objListName, mainEntityEntry = {}) {
  let entriesForSheet = [];

  if (mainEntityEntry[`${objListName}`]) {
    entriesForSheet = mainEntityEntry[`${objListName}`].map((olEntry) =>
      generateSingleEntryForObjListSheet(entitySchema, objListName, mainEntityEntry, olEntry));

  } else {
    entriesForSheet[0] = generateSingleEntryForObjListSheet(entitySchema, objListName);
  }

  return entriesForSheet;
}

function generateSingleEntryForObjListSheet(entitySchema, objListName, mainEntityData = {}, objListEntry = {}) {
  let olEntryForSheet = {};

  olEntryForSheet[`${entitySchema.entityName}Id`] = mainEntityData.id;
  entitySchema[`${objListName}`].scalarFields.reduce((singleEntry, sf) => {
    singleEntry[`${sf}`] = objListEntry[`${sf}`];

    return singleEntry;
  }, olEntryForSheet)

  return olEntryForSheet;
}

/**
 * Adds a new sheet to a workbook with data
 * @param {*} sheetName The name of the sheet to add
 * @param {*} workbook A workbook created via XLSX.utils.book_new()
 * @param {*} data The data saved in the sheet in shape of [{id:1, firstName:"aa",...},{id:2, firstname:"bb",...}]
 */
function addSheetToWorkbook(sheetName, workbook, data) {
  //this function generate the first row as to the name of the fields in the first object in data, e.g. "id", "firstName"...
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}