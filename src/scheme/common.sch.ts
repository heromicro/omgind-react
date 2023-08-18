import { OrgOrganItem } from './orgorgan.sch';

export type orgmixin = {
  org_id: string;
  org?: OrgOrganItem;
};

export type treemixin = {
  is_leaf: boolean;

  tree_id: number;
  tree_left: number;
  tree_right: number;
  tree_path: string;
};

export type timeparts = {
  created_at: Date;
  updated_at: Date;
};

export type sortparts = {
  sort: number;
};

export type activeparts = {
  is_active: boolean;
};

export type memoparts = {
  memo: string;
};

export type codeparts = {
  code: string;
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
