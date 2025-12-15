import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: { openAddPostModal: false,
    openFilterModal: true,
    myInfo: null,
    isAdmin: false,
    userInfo: null,
    totalPages: 0,
    listTag: [] as { tag_id: number; name: string }[],
    listComments: [] as any[],
    currentTag: null
   },
  reducers: {
    addPostModal: (state, action) => {
        state.openAddPostModal = action.payload
    },
    addFilterModal: (state, action) => {
        state.openFilterModal = action.payload
    },
    addMyInfo: (state, action) => {
        state.myInfo = action.payload.data;
    },
    clearMyInfo: (state) => {
      state.myInfo = null;
    },
    setUserInfo: (state, action) => {
        state.userInfo = action.payload.data;
    },
    addTag: (state, action) => {
      state.listTag = action.payload.tags.map((tag: any) => ({
        tag_id: tag.tag_id,
        name: tag.name
      }));
    },
    addListComments: (state, action) => {
      state.listComments = action.payload;
    },
    setCurrentTag: (state, action) => {
      state.currentTag = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { addPostModal, addFilterModal, addMyInfo, clearMyInfo, setUserInfo, addTag, addListComments, setCurrentTag, setIsAdmin } = serviceSlice.actions
export default serviceSlice.reducer;