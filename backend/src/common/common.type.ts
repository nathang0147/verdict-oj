export type FindAllResponse<T> = {count: number, items: T[]};

export type FindAllAndCount = {count: number, items: []};

export type ConditionPagination = {offset: number, limit: number};