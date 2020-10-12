import { createSlice } from '@reduxjs/toolkit';

export const chapterSlice = createSlice({
    name: 'chapter',
    initialState: {
        data: []
    },
    extraReducers: {
        'topic/setTopics': (state, action) => {
            const {entities: {chapters}} = action.payload
            state.data = chapters
        }
    }
});

export const selectChapterById = (id) => state => state.chapter.data[id];

export default chapterSlice.reducer;
