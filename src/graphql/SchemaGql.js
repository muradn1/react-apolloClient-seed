import gql from "graphql-tag";

export const TYPE_FRAGMENT = gql`
  fragment TypeFrag on __Type {
    name
    fields {
      name
      type {
        kind
        fields {
          name
          type {
            kind
          }
        }
        ofType {
          kind
          fields {
            name
            type {
              kind
            }
          }
        }
      }
    }
  }
`;

export const GET_TYPE = gql`
  query getType($typeName: String!) {
    __type(name: $typeName) {
      ...TypeFrag
    }
  }
  ${TYPE_FRAGMENT}
`;

export const GET_ALL_TYPES = gql`
  query getAllTypes {
    __schema {
      types {
        name
        kind
        description
      }
    }
  }
`;
