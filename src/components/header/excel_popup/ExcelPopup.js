import React, { useState, useEffect, useCallback } from 'react';
import "./excelPopup.scss";
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { RouterEnum } from '../../../enums/router-enum';
import GeneratorAndDownloader from '../../Excelerator/generator_and_downloader/GeneratorAndDownloader';
import { GET_ALL_USERS_FOR_EXCEL_QUERY, GET_All_USERS, SYNC_USERS } from '../../../graphql/UserGql';
import Uploader from '../../Excelerator/Uploader/Uploader';
import { EntitySchemaForExcel } from '../../Excelerator/Excelerator';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_ENTITY_SCHEMA_FOR_EXCEL } from '../../../graphql/SchemaGql';
import Saver from '../../Excelerator/Saver/Saver';


ExcelPopup.propTypes = {
    closePopup: PropTypes.func.isRequired,
    history: PropTypes.shape({
        listen: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}

function ExcelPopup({ closePopup, history }) {
    const [getEntitySchemaFromGQL, { error: getTypeError, loading: getTypeLoading, data: entitySchemaFromGQL }] = useLazyQuery(GET_ENTITY_SCHEMA_FOR_EXCEL);

    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    const [entityName, setEntityName] = useState("");
    const [getAllDataQueryForBuildingExcel, setGetAllDataQueryForBuildingExcel] = useState();
    const [allDataQueryName, setallDataQueryName] = useState("");
    const [getAllDataQueryForUpdatingState, setGetAllDataQueryForUpdatingState] = useState();
    const [syncMutation, setSyncMutation] = useState();

    useEffect(() => {
        let entityName;

        switch (history.location.pathname) {
            case RouterEnum.USERS: {
                entityName="User";
                setEntityName(entityName);

                //for gernerator-and-downloader comp
                setGetAllDataQueryForBuildingExcel(GET_ALL_USERS_FOR_EXCEL_QUERY);
                setallDataQueryName("allUsers");

                // for saver comp
                setGetAllDataQueryForUpdatingState(GET_All_USERS);
                setSyncMutation(SYNC_USERS);

                break;
            }
            case RouterEnum.OTHER: {
                setEntityName("Other");
                break;
            }
            default:
                return null;
        }
        getEntitySchemaFromGQL({ variables: { entityName } });
    }, [history, getEntitySchemaFromGQL]);

    const covnertEntityGQLSchemaToExcelAcceptedSchema = useCallback(
        (entitySchemaFromGQL) => {

            //this function is only used on {embedded objs , on objList}
            const deleteNonScalarFields = (fields) => {
                return fields.filter(f => f.type.kind === "SCALAR")
            }

            const convertFieldsFromGqlToExcelAcceptedSchema = (fields) => {
                const schemaForExcel = new EntitySchemaForExcel();

                fields.forEach(field => {
                    const fieldKind = field.type.kind === "NON_NULL" ? field.type.ofType.kind : field.type.kind;
                    console.log(fieldKind);
                    switch (fieldKind) {
                        case "SCALAR":
                            schemaForExcel.scalarFields.push(field.name);
                            break;

                        case "OBJECT":
                            schemaForExcel.embeddedObjsNames.push(field.name);
                            schemaForExcel[field.name] = convertFieldsFromGqlToExcelAcceptedSchema(deleteNonScalarFields(field.type.fields));
                            break;

                        case "LIST": {
                            if (field.type.ofType.kind === "SCALAR") {
                                schemaForExcel.scalarListsNames.push(field.name);
                                break;
                            }

                            let listFields;
                            if (field.type.ofType.kind === "LIST") {
                                listFields = field.type.ofType.ofType.fields;
                            } else { //if(field.type.ofType.kind == "OBJECT")
                                listFields = field.type.ofType.fields;
                            }
                            listFields = deleteNonScalarFields(listFields);

                            schemaForExcel.objsListsNames.push(field.name);
                            schemaForExcel[field.name] = convertFieldsFromGqlToExcelAcceptedSchema(listFields);

                            break;
                        }

                        default:
                            break;
                    }

                });

                return schemaForExcel;
            }

            const fields = entitySchemaFromGQL.__type.fields;
            const entitySchemaForExcel = convertFieldsFromGqlToExcelAcceptedSchema(fields);
            entitySchemaForExcel.entityName = entityName;

            return entitySchemaForExcel;
        },
        [entityName]
    )

    const [entitySchemaForExcel, setEntitySchemaForExcel] = useState();
    const [isPopUpReady, setIsPopUpReady] = useState(false);
    

    useEffect(() => {
        if (entitySchemaFromGQL) {
            setEntitySchemaForExcel(covnertEntityGQLSchemaToExcelAcceptedSchema(entitySchemaFromGQL));
            setIsPopUpReady(true);
        }

    }, [entitySchemaFromGQL, covnertEntityGQLSchemaToExcelAcceptedSchema]);

    const [syncMutationVariables, setSyncMutationVariables] = useState();

    const onFileLoad = (dataFromExcel) => {
        setIsSaveDisabled(false);

        switch (history.location.pathname) {
            case RouterEnum.USERS:
                setSyncMutationVariables({ variables: { users: dataFromExcel } });
                break;
        
            default:
                break;
        }
    }

    if (getTypeError) {
        return <div>error loading entity type</div>
    }

    if (getTypeLoading) {
        return <div>loading...</div>
    }

    if(!isPopUpReady){
        return <div>loading initial data</div>
    }

    return (
        <div className="excel-popup">
            <div className="close-icon" onClick={closePopup}><img src="icons/clear_grey_27x27.png" alt="..." /></div>
            <div className="my-header"><span style={{ fontWeight: "bold" }}>{entityName + "s"}</span>{" data in excel"}</div>
            <div className="content">

                <div className="generator-and-downloader">
                    <GeneratorAndDownloader
                        getAllDataQuery={getAllDataQueryForBuildingExcel}
                        getAllDataQueryName={allDataQueryName}
                        entitySchemaForExcel={entitySchemaForExcel}
                        />
                </div>

                <div className="uploader">
                    <Uploader onFileLoad={onFileLoad} entitySchemaForExcel={entitySchemaForExcel} />
                </div>

                <div className="saver">
                    <Saver
                        closePopup={closePopup}
                        isDisabled = {isSaveDisabled}
                        syncMutation={syncMutation}
                        syncMutationVariables= {syncMutationVariables}
                        getAllQuery={getAllDataQueryForUpdatingState}
                        entitySchemaForExcel={entitySchemaForExcel}
                    />
                </div>
            </div>
        </div>
    )
}

export default withRouter(ExcelPopup);

