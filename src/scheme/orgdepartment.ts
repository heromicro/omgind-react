import { OrgOrganItem } from './orgorgan';

export type OrgDepartmentItem = {
  id: string;

  name: string;
  code: string;
  org_id: string;

  memo?: string;
  sort: number;
  is_active: boolean;

  org?: OrgOrganItem;

  created_at: Date;
  updated_at: Date;
  creator?: string;
};
