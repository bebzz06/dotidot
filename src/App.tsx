import Table from "./components/Table";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import { useDataSourcesQuery } from "./useRequest";
import { GET_DATA_SOURCES } from "./graphql";

const App = () => {
  const { loading, error, data } = useDataSourcesQuery(GET_DATA_SOURCES);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  const queryData = data.collection.dataSources;

  return (
    <>
      <Table dataSources={queryData} />
    </>
  );
};

export default App;
