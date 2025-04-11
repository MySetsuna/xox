import { create, type ExtractState } from 'zustand';
import { createViewSlice } from './view';
import { createTagSlice } from './tag';

export type RootState = any;

const useRootStore = create((set) => ({
  userList: [],
  user: null,
  setUser: (user: any) => set({ user }),

  mode: 'grid', // 0 :grid 默认, 1: date-groups 日期分组 , 2:tag-groups 标签分组 3: schedule
  setMode: (mode: any) => set({ mode }),
  ...createViewSlice(set),
  ...createTagSlice(set)
}));
export default useRootStore;
