import gql from 'graphql-tag';

const UserFragment = gql`
    fragment UserEntireFields on User {
    id
      firstName
      lastName
      email
      avatar
      address{
          city
          street
      }
      certifications
      children {
        id
        name
        age
      }
    }
`;

const SyncResultFragment = gql`
    fragment usersSyncResult on UsersSyncResult {
        usersCreated {
            id
        }
        usersUpdated {
            id
        }
        deletedUsersIds
    }
`;

export const GET_All_USERS = gql`
    query AllUsers{
        allUsers {
            id
            firstName
            lastName
            email
            children{
                id
                name
            }
        }
    }
    
`;
export const GET_ALL_USERS_FOR_EXCEL_QUERY = gql`
      query allUsersForExcel{
        allUsers {
            ...UserEntireFields
        }
      }
      ${UserFragment}
`;

export const USER_BY_ID_QUERY = gql`
      query User($id: ID!) {
        User(id: $id){
            ...UserEntireFields
        }
      }
      ${UserFragment}
`;

export const SYNC_USERS = gql`
    mutation SyncUsers($users: [UserInput]){
        syncUsers(users: $users){
            ...usersSyncResult
        }
    }
    ${SyncResultFragment}
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($user: UserInput){
        updateUser(user: $user){
            ...UserEntireFields
        }
    }
    ${UserFragment}
`;


export const CREATE_USER = gql`
    mutation CreateUser($user: UserInput){
        createUser(user: $user){
            ...UserEntireFields
        }
    }
    ${UserFragment}
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!){
        id: deleteUser(id: $id)
    }
`;

export class User {
    id;
    firstName;
    lastName;
    email;
    avatar;
    children;

    constructor({ id, firstName, lastName, email, avatar, children }) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.avatar = avatar;
        if (Array.isArray(children)) {
            this.children = children.map(child => new Child(child));
        }
    }
}

export class Child {
    id;
    name;
    age;

    constructor({ id, age, name }) {
        this.id = id;
        this.age = age;
        this.name = name;
    }
}
