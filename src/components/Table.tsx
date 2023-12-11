import { IDataSource } from "../types";
import { useMemo, useState, useEffect } from "react";
import { UPDATE_DATA_SOURCES } from "../graphql";
import { useDataSourceMutation } from "../useRequest";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  RowData,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
const columnHelper = createColumnHelper<IDataSource>();
const defaultColumns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("archived", {
    header: () => "Archived",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Created",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("icon", {
    header: () => "Icon",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("itemsCount", {
    header: "Items Count",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("lastImport", {
    header: "Last Update",
    footer: (info) => info.column.id,
  }),
];

const defaultColumn: Partial<ColumnDef<IDataSource>> = {
  cell: ({ getValue, row: { index }, column: { id: columnName }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const { updateDataSource } = useDataSourceMutation(UPDATE_DATA_SOURCES);
    const dataSourceId = () => {
      const matchingDataSource = table.options.data.find((dataSource) => {
        if (typeof initialValue === "boolean") {
          return dataSource.archived === initialValue;
        } else {
          return dataSource.name === initialValue;
        }
      });
      return matchingDataSource?.id;
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateDataSource({
        variables: { name: e.target.value, id: dataSourceId() },
      });
      setValue(e.target.value);
    };
    // When the input is blurred, we'll call our table meta's updateData function
    const handleBlur = () => {
      table.options.meta?.updateData(index, columnName, value);
    };
    const handleCheckboxChange = () => {
      const newValue = !value;
      updateDataSource({
        variables: { archived: newValue, id: dataSourceId() },
      });
      setValue(newValue);
      table.options.meta?.updateData(index, columnName, newValue);
    };
    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    let dateString;
    let formattedDate;
    switch (columnName) {
      case "name":
        return (
          <input
            value={value as string}
            onChange={handleTextChange}
            onBlur={handleBlur}
          />
        );
      case "archived":
        return (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={handleCheckboxChange}
          />
        );
      case "lastImport":
      case "createdAt":
        dateString = new Date(value as number);
        formattedDate = dateString.toLocaleString();
        return <span>{formattedDate}</span>;
      default:
        return <span>{value as string}</span>;
    }
  },
};

interface ITableProps {
  dataSources: IDataSource[];
}

const Table: React.FC<ITableProps> = ({ dataSources }) => {
  const [data] = useState(() => [...dataSources]);
  const columns = useMemo(() => [...defaultColumns], []);
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });
  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />
            Toggle All
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {table.getLeafHeaders().map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                <label>
                  <input
                    {...{
                      type: "checkbox",
                      checked: header.column.getIsVisible(),
                      onChange: header.column.getToggleVisibilityHandler(),
                    }}
                  />{" "}
                </label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
};

export default Table;
