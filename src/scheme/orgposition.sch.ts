import { timeparts, orgmixin } from './common.sch';

import { OrgOrganItem } from './orgorgan.sch';

export type OrgPositionItem = {
  id: string;

  name: string;

  code: string;
  org_id: string;

  sort: number;
  is_active: boolean;
  memo?: string;

  org?: OrgOrganItem;

  creator?: string;
} & orgmixin &
  timeparts;
