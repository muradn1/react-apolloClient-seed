import gql from "graphql-tag";

 const ENTITY_SCEMA_FOR_EXCEL_FRAGMENT = gql`
  fragment EntitySchemaForExcel on __Type {
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
  }
`;

export const GET_ENTITY_SCHEMA_FOR_EXCEL = gql`
  query getType($entityName: String!) {
    __type(name: $entityName) {
      ...EntitySchemaForExcel
    }
  }
  ${ENTITY_SCEMA_FOR_EXCEL_FRAGMENT}
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
