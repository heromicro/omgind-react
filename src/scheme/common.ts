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
