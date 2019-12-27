import XLSX from 'xlsx';

export default function Excelerator() {

    function getCsvHeader(fields) {
        const objectNames = getObjectNames(fields);

        const objects = fields.filter(({ name }) => objectNames.includes(name));
        const nonObjects = fields.filter(({ name }) => !objectNames.includes(name));

        const objectCsvData = objects.map(({ name }) => {
            return [1, 2, 3].map(i => ({ [`${name}${i}`]: {} }));
        });

        const nonObjectCsvData = nonObjects.map(({ name }) => ({ [name]: {} }));

        return [...nonObjectCsvData, ...objectCsvData.flat()];
    }

    function downloadCsv(data, fileName) {
        const newWorkbook = XLSX.utils.book_new();

        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(newWorkbook, worksheet);
        
        XLSX.writeFile(newWorkbook, `${fileName}.csv`);
    }

    function uploadCsv(data) {
        const workbook = XLSX.read(data, {
            type: 'binary'
        });

        const rows = workbook.SheetNames.map(name => XLSX.utils.sheet_to_json(workbook.Sheets[name]))

        return rows;
    }

    function getObjectNames(gqlObjectFields) {
        return gqlObjectFields
            .filter(({ type }) => type.ofType && type.ofType.kind === 'OBJECT')
            .map(({ name }) => name);
    }

    return {
        getCsvHeader,
        downloadCsv,
        uploadCsv
    };
}