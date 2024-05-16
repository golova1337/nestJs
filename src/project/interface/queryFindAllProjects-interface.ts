import { PerPage } from '../enum/perPage-enum';
import { Field, Order } from '../enum/sort-enum';
import { Status } from '../enum/status-enum';

export interface FindAllProject {
  page?: string;
  perPage?: PerPage;
  userId?: string;
  sortField?: Field;
  sortOrder?: Order;
  title?: string;
  status?: Status;
}
