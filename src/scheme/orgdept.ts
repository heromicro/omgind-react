import { OrgOrganItem } from './orgorgan';
import { timeparts, treemixin, orgmixin } from './common';

export type OrgDeptItem = {
  id: string;

  pid?: string;
  parent?: OrgDeptItem;
  children?: OrgDeptItem[];

  name: string;
  merge_name: string;
  code: string;
  org_id: string;

  memo?: string;
  sort: number;
  is_active: boolean;

  creator?: string;
} & orgmixin &
  treemixin &
  timeparts;
