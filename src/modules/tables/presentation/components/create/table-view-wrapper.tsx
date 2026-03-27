"use client";

import { Column } from "@/modules/tables/domain/entity/column";
import { CreateRecordModal } from "@/modules/tables/presentation/components/create/create-record-modal";
import {
  FormCreateProvider,
  useFormCreateContext,
} from "@/modules/tables/presentation/context/form-create-context";
import {
  RecordModalProvider,
  useRecordModal,
} from "@/modules/tables/presentation/context/record-modal-context";

interface TableWrapperProps {
  tableName: string;
  columns: Column[];
  children: React.ReactNode;
}

function ModalContainer({
  tableName,
  columns,
}: {
  tableName: string;
  columns: Column[];
}) {
  const { isOpen, onOpenChange } = useRecordModal();

  return (
    <CreateRecordModal
      tableName={tableName}
      columns={columns}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
}

function ContextInner({ children }: { children: React.ReactNode }) {
  const { setInitialData } = useFormCreateContext();
  return (
    <RecordModalProvider setInitialData={setInitialData}>
      {children}
    </RecordModalProvider>
  );
}

export function TableViewWrapper({
  tableName,
  columns,
  children,
}: TableWrapperProps) {
  return (
    <FormCreateProvider>
      <ContextInner>
        {children}
        <ModalContainer tableName={tableName} columns={columns} />
      </ContextInner>
    </FormCreateProvider>
  );
}
