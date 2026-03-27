import { TableType } from "@/modules/tables/domain/enum/table-type";
import { getTables } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { TableSearchList } from "@/modules/tables/presentation/sections/table-search-list";

export default async function TablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getTables();

  const tables = result.filter((t) => t.type === TableType.TABLE);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <aside className="w-64 max-w-64 overflow-hidden h-dvh border-r border-gray-200 shrink-0 flex flex-col">
        <TableSearchList initialTables={tables} />
      </aside>
      <main className="flex-1 h-full overflow-hidden">{children}</main>
    </div>
  );
}
