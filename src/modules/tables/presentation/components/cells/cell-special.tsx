import { Column } from "@/modules/tables/domain/entity/column";
import { CopyButton } from "@/shared/presentation/components/button/copy-button";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { LinkIcon } from "lucide-react";
import { useRelationModal } from "../../context/relation-modal.context";

interface Props {
  value: string;
  isForeignKey?: boolean;
  column: Column;
}

export function CellSpecial({ value, isForeignKey, column }: Props) {
  const { openModal } = useRelationModal();

  const handleFkClick = () => {
    if (column.foreignKey) {
      openModal(column.foreignKey.table, column.foreignKey.column, value);
    }
  };

  return (
    <Badge
      variant="secondary"
      className={`font-mono gap-1 ${isForeignKey ? "cursor-pointer" : ""}`}
      onClick={handleFkClick}
    >
      {isForeignKey && <LinkIcon className="size-3" />}
      {value}
      <CopyButton value={value} />
    </Badge>
  );
}
