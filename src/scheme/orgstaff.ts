import { OrgOrganItem } from './orgorgan';
import { SysAddressItem } from './sysaddress';
import { SysDictItem } from './sysdict';

export type OrgStaffItem = {
  id: string;

  first_name: string;
  last_name: string;
  mobile: string;

  iden_no: string;
  gender: string;
  gender_dict_id?: string;
  gender_dict?: SysDictItem;
  birth_date: string;

  emp_stat: number;
  empst_dict_id: string;
  empst_dict: SysDictItem;

  worker_no: string;
  cubicle: string;
  entry_date: string;
  regular_date: string;
  resign_date: string;

  org_id: string;
  org?: OrgOrganItem;

  sort: number;
  is_active: boolean;
  memo?: string;

  iden_addr?: SysAddressItem;
  resi_addr?: SysAddressItem;

  created_at: string;
  updated_at: string;
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
