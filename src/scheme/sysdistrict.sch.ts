import { timeparts, treemixin } from './common.sch';

export type SysDistrctItem = {
  id: string;
  pid?: string;
  parent?: SysDistrctItem;
  name: string;
  sname: string;
  name_en?: string;
  sname_en?: string;
  abbr?: string;
  suffix?: string;
  st_code?: string;
  initials?: string;
  pinyin?: string;
  merge_name?: string;
  extra?: string;
  zip_code?: string;
  area_code?: string;

  longitude?: number;
  latitude?: number;

  is_del?: boolean;

  is_active?: boolean;
  is_main?: boolean;
  is_hot?: boolean;
  is_real?: boolean;
  is_direct?: boolean;

  creator?: string;

  children?: SysDistrctItem[];
  loading?: boolean;
} & treemixin &
  timeparts;
