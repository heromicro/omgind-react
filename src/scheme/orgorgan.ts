import { timeparts } from './common';

import { SysAddressItem } from './sysaddress';

export type OrgOrganItem = timeparts & {
  id: string;

  name: string;
  sname: string;
  code: string;
  iden_no: string;
  owner_id: string;

  haddr?: SysAddressItem;
  sort: number;
  is_active: boolean;
  memo?: string;

  creator?: string;
};
