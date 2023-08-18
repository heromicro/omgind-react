import { timeparts, orgmixin } from './common.sch';
import { SysAddressItem } from './sysaddress.sch';
import { SysDictItem } from './sysdict.sch';
import { OrgDeptItem } from './orgdept.sch';
import { OrgPositionItem } from './orgposition.sch';

export type OrgStaffItem = {
  id: string;

  first_name: string;
  last_name: string;
  mobile: string;

  iden_no: string;
  gender: number;
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

  dept_id: string;
  dept: OrgDeptItem;
  posi_id: string;
  position: OrgPositionItem;

  sort: number;
  is_active: boolean;
  memo?: string;

  iden_addr?: SysAddressItem;
  resi_addr?: SysAddressItem;

  creator?: string;
} & orgmixin &
  timeparts;

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
