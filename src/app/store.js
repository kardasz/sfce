import { configureStore } from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import logger from "redux-logger";

import topicReducer from '../features/topic/topicSlice';
import chapterReducer from '../features/chapter/chapterSlice';
import referenceReducer from '../features/reference/referenceSlice';

export default configureStore({
  reducer: {
    topic: topicReducer,
    reference: referenceReducer,
    chapter: chapterReducer
  },
  middleware: [thunk, logger]
});
