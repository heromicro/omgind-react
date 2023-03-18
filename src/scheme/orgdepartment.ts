export type OrgDepartmentItem = {
  id: string;

  name: string;
  code: string;
  org_id: string;

  memo?: string;
  sort: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
  creator?: string;
};
