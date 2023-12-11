import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";
export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: "https://stage.dotidot.io/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: import.meta.env.VITE_TOKEN,
  },
});
export const GET_DATA_SOURCES = gql`
  query DataSources {
    collection(
      page: 0
      limit: 100
      identifier: "organization"
      organizationId: 19952
    ) {
      dataSources {
        id
        name
        archived
        createdAt
        icon
        itemsCount
        lastImport
      }
    }
  }
`;
export const UPDATE_DATA_SOURCES = gql`
  mutation UpdateDataSource($id: BigInt!, $name: String, $archived: Boolean) {
    updateDataSource(id: $id, name: $name, archived: $archived) {
      dataSource {
        name
        archived
      }
    }
  }
`;
