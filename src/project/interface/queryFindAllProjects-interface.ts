import { PerPage } from '../enum/perPage-enum';
import { Field, Order } from '../enum/sort-enum';
import { Status } from '../enum/status-enum';

export interface Pagination {
  page?: string;
  perPage?: PerPage;
}

export interface Sorting {
  sortBy?: Field;
  sortOrder?: Order;
}

export interface StatusProject {
  status?: Status;
}
export interface Title {
  title?: string;
}

export interface QueryFindAllProjects
  extends Pagination,
    Sorting,
    StatusProject,
    Title {}
