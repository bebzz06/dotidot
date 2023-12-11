import { useQuery, DocumentNode, useMutation } from "@apollo/client";

export const useDataSourcesQuery = (gqlQuery: DocumentNode) => {
  const { loading, error, data } = useQuery(gqlQuery);
  return { loading, error, data };
};
export const useDataSourceMutation = (gqlMutation: DocumentNode) => {
  const [updateDataSource] = useMutation(gqlMutation);
  return { updateDataSource };
};
