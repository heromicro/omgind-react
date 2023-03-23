import { timeparts } from './common';
import { OrgOrganItem } from './orgorgan';
import { SysAddressItem } from './sysaddress';
import { SysDictItem } from './sysdict';

export type OrgStaffItem = timeparts & {
  id: string;

  first_name: string;
  last_name: string;
  mobile: string;

  iden_no: string;
  gender: string;
  gender_dict_id?: string;
  gender_dict?: SysDictItem;
  birth_date: string;

  empy_stat: number;
  empyst_dict_id: string;
  empyst_dict: SysDictItem;

  worker_no: string;
  cubicle: string;
  entry_date: Date;
  regular_date: Date;
  resign_date: Date;

  org_id: string;
  org?: OrgOrganItem;

  sort: number;
  is_active: boolean;
  memo?: string;

  iden_addr?: SysAddressItem;
  resi_addr?: SysAddressItem;

  // created_at: Date;
  // updated_at: string;
  creator?: string;
};

export function calculateGenderShow(gender: number): string {
  if (gender === undefined || gender === null) {
    return '';
  }
  switch (gender) {
    case 1:
      return '男';
    case 2:
      return '女';
    default:
      return '';
  }

  return '';
}

export function calculateEmployeStatShow(stat: number): string {
  if (stat === undefined || stat === null) {
    return '';
  }
  switch (stat) {
    case 1:
      return '在职';
    case 2:
      return '停职';
    case 3:
      return '离职';
    case 4:
      return '解雇';
    default:
      return '';
  }
  return '';
}
