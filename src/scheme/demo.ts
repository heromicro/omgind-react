import { timeparts } from './common';

export type DemoItem = timeparts & {
  id: string;
  code: string;
  name: string;
  memo: string;
  is_active: boolean;
  sort: number;

  creator?: string;
};
