export const createViewSlice = (set: any) => ({
  views: [],
  setViews: (views: []) => set({ views }),
  addView: (view: any) =>
    set((state: any) => ({ views: [...state.views, view] })),
  removeView: (view: any) =>
    set((state: any) => ({
      views: state.views.filter((v: any) => v !== view),
    })),
  rootView: null,
  setRootView: (view: any) => set({ rootView: view }),
});
