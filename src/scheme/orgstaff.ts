export type OrgStaffItem = {
  id: string;

  first_name: string;
  last_name: string;
  mobile: string;

  iden_no: string;
  gender: string;
  birth_date: string;

  org_id: string;
  entry_date: string;
  regular_date: string;

  sort: number;
  is_active: boolean;
  memo?: string;

  created_at: string;
  updated_at: string;
  creator?: string;
};
