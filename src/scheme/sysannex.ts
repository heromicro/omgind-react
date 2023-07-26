import { timeparts, sortparts, activeparts, memoparts } from './common';

export type SysAnnexItem = timeparts &
  sortparts &
  activeparts &
  memoparts & {
    id: string;
    name: string;
    file_path: string;
  };
