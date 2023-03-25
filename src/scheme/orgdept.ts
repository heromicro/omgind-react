import { OrgOrganItem } from './orgorgan';
import { timeparts, treemixin } from './common';

export type OrgDeptItem = {
  id: string;

  name: string;
  code: string;
  org_id: string;

  memo?: string;
  sort: number;
  is_active: boolean;

  org?: OrgOrganItem;

  creator?: string;
} & treemixin &
  timeparts;
