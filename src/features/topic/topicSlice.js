import { createSlice } from '@reduxjs/toolkit';
export const topicSlice = createSlice({
    name: 'topic',
    initialState: {
        ids: [],
        data: []
    },
    reducers: {
        setTopics: (state, action) => {
            const {entities: {topics}, result} = action.payload
            state.data = topics
            state.ids = result
            state.currentId = (result.length) ? result[0] : null
        },
        setCurrentTopicId: (state, action) => {
            state.currentId = action.payload
        }
    },
});

export const { setTopics } = topicSlice.actions;

export const selectTopicById = (id) => state => state.topic.data[id];
export const selectTopicIds = state => state.topic.ids;

export default topicSlice.reducer;
