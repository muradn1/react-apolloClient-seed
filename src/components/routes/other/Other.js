import React, { useState } from 'react'
import "./other.scss"
import Uploader from '../../Excelerator/Uploader/Uploader'
import CsvGenerator from '../../Excelerator/Generator/CsvGenerator'
import { CREATE_USER, GET_All_USERS, UPDATE_USER } from '../../../graphql/UserGql';
import Saver from '../../Excelerator/Saver/Saver';


export default function Other() {

    const [dataFromCsv, setDataFromCsv] = useState([]);

    const onFileRead = (data) => {
        setDataFromCsv(data);
    }

    return (
        <div>
            <p className="others">Csv</p>
            <Uploader onFileRead={onFileRead} />
            <CsvGenerator />
            <Saver typeToCreate="user" data={dataFromCsv}
                createQuery={CREATE_USER}
                getAllQuery={GET_All_USERS}
                updateQuery={UPDATE_USER} />
        </div>
    )
}
