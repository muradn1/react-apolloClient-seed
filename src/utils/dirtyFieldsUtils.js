
export const getOnlyDirtyFields = ({ values, dirtyFields, subEntitesFieldName }) => {
    const entity = {};

    if (values.id) {
        entity.id = values.id;
    }

    for (const key in dirtyFields) {

        if (key.startsWith(subEntitesFieldName)) {
            if (entity[subEntitesFieldName] === undefined) {
                entity[subEntitesFieldName] = new Array(values[subEntitesFieldName].length).fill(0).map((_, index) => {
                    const subEntity = {};
                    if (values[subEntitesFieldName][index].id !== undefined) {
                        subEntity.id = values[subEntitesFieldName][index].id;
                    }

                    return subEntity;
                });
            }

            if (key.startsWith(subEntitesFieldName + "[")) {
                const subEntityIndex = parseInt(key.substr(key.indexOf("[") + 1, 1));
                const subFieldName = key.substr(key.indexOf(".") + 1);

                entity[subEntitesFieldName][subEntityIndex][subFieldName] = values[subEntitesFieldName][subEntityIndex][subFieldName]
            }

        } else {
            entity[key] = values[key];
        }
    }
    
    return entity;
}