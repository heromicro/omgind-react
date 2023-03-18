import { SysAddressItem } from './sysaddress';

export type OrgOrganItem = {
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

  created_at: string;
  updated_at: string;
  creator?: string;
};
