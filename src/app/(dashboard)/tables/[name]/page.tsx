import { getCredentials } from "@/modules/database/infrastructure/sa/database.sa";
import {
  getColumns,
  getData,
  getTotalCount,
} from "@/modules/tables/infrastructure/sa/tabla.sa";
import { InputWhere } from "@/modules/tables/presentation/components/where/input-where";
import { TableDetailHeader } from "@/modules/tables/presentation/sections/table-detail-header";
import { TableViewWrapper } from "../../../../modules/tables/presentation/components/create/table-view-wrapper";
import {
  DataRow,
  TableContent,
} from "../../../../modules/tables/presentation/sections/table-content";

interface Props {
  params: Promise<{ name: string }>;
  searchParams: Promise<{
    sort?: string;
    order?: "asc" | "desc";
    where?: string;
  }>;
}

export default async function TablesPage({ params, searchParams }: Props) {
  const sessionDatabase = await getCredentials()
  if (!sessionDatabase) return

  const { name } = await params;
  const { sort, order, where } = await searchParams;

  const columns = await getColumns(name);
  const totalCount = await getTotalCount(name, where);
  const { data: initialData, error } = await getData(
    name,
    1,
    30,
    sort,
    order,
    where,
  );

  return (
    <TableViewWrapper tableName={name} columns={columns}>
      <div className="w-full h-full flex flex-col overflow-hidden bg-background">
        {/* Header section */}
        <TableDetailHeader
          name={name}
          totalCount={totalCount}
          columns={columns}
        />

        <InputWhere currentWhere={where} />
        <TableContent
          tableName={name}
          initialData={initialData as DataRow[]}
          columns={columns}
          initialTotal={totalCount}
          initialError={error}
          currentSort={sort}
          currentOrder={order}
          currentWhere={where}
        />
      </div>
    </TableViewWrapper>
  );
}
