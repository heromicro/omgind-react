import { timeparts } from './common.sch';

import { SysAddressItem } from './sysaddress.sch';

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
