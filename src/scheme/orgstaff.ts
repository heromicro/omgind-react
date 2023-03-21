import { OrgOrganItem } from './orgorgan';
import { SysAddressItem } from './sysaddress';

export type OrgStaffItem = {
  id: string;

  first_name: string;
  last_name: string;
  mobile: string;

  iden_no: string;
  gender: string;
  birth_date: string;

  worker_no: string;
  cubicle: string;
  entry_date: string;
  regular_date: string;
  resign_date: string;

  org_id: string;

  sort: number;
  is_active: boolean;
  memo?: string;

  org?: OrgOrganItem;
  iden_addr?: SysAddressItem;
  resi_addr?: SysAddressItem;

  created_at: string;
  updated_at: string;
  creator?: string;
};
