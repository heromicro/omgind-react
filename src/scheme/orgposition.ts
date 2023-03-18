export type OrgPositionItem = {
  id: string;

  name: string;

  code: string;
  org_id: string;

  sort: number;
  is_active: boolean;
  memo?: string;

  created_at: string;
  updated_at: string;
  creator?: string;
};
