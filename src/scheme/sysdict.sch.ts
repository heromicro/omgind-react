import { timeparts } from './common.sch';

export type SysDictItemItem = timeparts & {
  id: string;
  label: string;
  value: string;
  is_active: boolean;
  memo: string;
  sort: number;
  dict_id: string;
};

export type SysDictItem = {
  id: string;
  name_cn: string;
  name_en: string;
  dict_key: string;

  is_active: boolean;
  memo: string;
  sort: number;
  items: SysDictItemItem[];
};
