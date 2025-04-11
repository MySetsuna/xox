export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface TagState {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updatedTag: Partial<Tag>) => void;
  reset: () => void;
}

export const createTagSlice = (set: any) => ({
  tags: [] as Tag[],
  addTag: (tag: Tag) =>
    set((state: TagState) => ({ tags: [...state.tags, tag] })),
  removeTag: (id: string) =>
    set((state: TagState) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    })),
  updateTag: (id: string, updatedTag: Partial<Tag>) =>
    set((state: TagState) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updatedTag } : tag
      ),
    })),
  reset: () => set({ tags: [] }),
});
