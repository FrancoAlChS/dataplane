export interface PageParams {
  params: Promise<{ tableName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
