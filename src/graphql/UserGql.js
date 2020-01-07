import gql from 'graphql-tag';

export const UserFragment = gql`
    fragment UserEniteFields on User {
        id
        firstName
        lastName
        email
        avatar
        children{
            id
            name
            age
        }
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

export const USER_BY_ID_QUERY = gql`
      query User($id: ID!) {
        User(id: $id){
            ...UserEniteFields
        }
      }
      ${UserFragment}
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($userInput: UserInput){
        updateUser(userInput: $userInput){
            ...UserEniteFields
        }
    }
    ${UserFragment}
`;

export const CREATE_USER = gql`
    mutation CreateUser($userInput: UserInput){
        createUser(userInput: $userInput){
            ...UserEniteFields
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
        this.children = children.map(child => new Child(child));

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
