export type SysDistrctItem = {
  id: string;
  pid?: string;
  name: string;
  sname: string;
  abbr?: string;
  suffix?: string;
  st_code?: string;
  initials?: string;
  pinyin?: string;
  merge_name?: string;
  extra?: string;

  longitude?: number;
  latitude?: number;

  is_active?: boolean;
  is_del?: boolean;
  is_main?: boolean;
  is_hot?: boolean;
  is_real?: boolean;
  is_direct?: boolean;

  isLeaf: boolean;

  tree_id: number;
  tree_left: number;
  tree_right: number;
  tree_path: string;

  created_at: string;
  updated_at: string;
  creator?: string;

  children?: SysDistrctItem[];
  loading?: boolean;
};
