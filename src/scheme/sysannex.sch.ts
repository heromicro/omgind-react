import { timeparts, sortparts, activeparts, memoparts } from './common.sch';

export type SysAnnexItem = timeparts &
  sortparts &
  activeparts &
  memoparts & {
    id: string;
    name: string;
    file_path: string;
  };
