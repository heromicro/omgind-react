import { timeparts } from './common';

import { OrgOrganItem } from './orgorgan';

export type OrgPositionItem = timeparts & {
  id: string;

  name: string;

  code: string;
  org_id: string;

  sort: number;
  is_active: boolean;
  memo?: string;

  org?: OrgOrganItem;

  creator?: string;
};
