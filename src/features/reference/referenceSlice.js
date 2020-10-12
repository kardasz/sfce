import {createSlice} from '@reduxjs/toolkit';

export const referenceSlice = createSlice({
    name: 'reference',
    initialState: {
        data: []
    },
    reducers: {
        updateReference: (state, action) => {
            const {id, reviewed} = action.payload
            state.data[id].reviewed = reviewed
        }
    },
    extraReducers: {
        'topic/setTopics': (state, action) => {
            const {entities: {references}} = action.payload
            state.data = references
        }
    }
});

export const { updateReference } = referenceSlice.actions;

export const setReferenceReviewed = (id, reviewed) => dispatch => {
    localStorage.setItem(id, reviewed)
    dispatch(updateReference({id, reviewed}))
};

export const selectReferenceById = (id) => state => state.reference.data[id];
export const selectReferenceIsReviewedById = (id) => () => 'true' === localStorage.getItem(id);


export default referenceSlice.reducer;

