export type PaginationTrigger = 
  | { type: 'filters' | 'sort'; pageIndex: number; pageSize: number;}
  | { type: 'next'; link: string }
  | { type: 'prev'; link: string };
