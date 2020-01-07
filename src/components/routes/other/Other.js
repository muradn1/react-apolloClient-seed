import React, { useState } from 'react'
import "./other.scss"
import Uploader from '../../Excelerator/Uploader/Uploader'
import ExcelGenerator from '../../Excelerator/Generator/ExcelGenerator'
import { CREATE_USER, GET_All_USERS, UPDATE_USER, User } from '../../../graphql/UserGql';
import Saver from '../../Excelerator/Saver/Saver';
import { gql } from 'apollo-boost';

const GET_ALL_USERS_QUERY = gql`
  {
    allUsers {
      id
      firstName
      lastName
      email
      avatar
      children {
        id
        name
        age
      }
    }
  }
`;

export default function Other() {

    const [dataFromExcel, setDataFromExcel] = useState([]);

    const onFileRead = (data) => {
        setDataFromExcel(data.map(entry => new User(entry)));
    }

    return (
        <div>
            <Uploader onFileRead={onFileRead} />
            <ExcelGenerator
                getAllDataQuery={GET_ALL_USERS_QUERY}
                typeName="User" />
            <Saver typeToCreate="user" data={dataFromExcel}
                createQuery={CREATE_USER}
                getAllQuery={GET_All_USERS}
                updateQuery={UPDATE_USER} />
        </div>
    )
}
