export const POSTGRES_TYPES = [
  // Numeric
  "smallint",
  "integer",
  "bigint",
  "decimal",
  "numeric",
  "real",
  "double precision",
  "smallserial",
  "serial",
  "bigserial",
  
  // Monetary
  "money",

  // Character
  "character varying",
  "varchar",
  "character",
  "char",
  "text",

  // Binary
  "bytea",

  // Date/Time
  "timestamp",
  "timestamp with time zone",
  "date",
  "time",
  "time with time zone",
  "interval",

  // Boolean
  "boolean",

  // Geometric
  "point",
  "line",
  "lseg",
  "box",
  "path",
  "polygon",
  "circle",

  // Network Address
  "cidr",
  "inet",
  "macaddr",
  "macaddr8",

  // Bit String
  "bit",
  "bit varying",

  // Text Search
  "tsvector",
  "tsquery",

  // UUID
  "uuid",

  // XML
  "xml",

  // JSON
  "json",
  "jsonb",

  // Arrays
  "array",
  "text[]",
  "integer[]",
  "jsonb[]",
];
