import React, {useEffect} from "react";
import {Routes, Route, HashRouter} from 'react-router-dom'
import TopicMenu from "../topic/TopicMenu";
import Topic from "../topic/Topic";
import {selectTopicIds, setTopics} from "../topic/topicSlice";
import {data} from "../../data";
import {useDispatch, useSelector} from "react-redux";
import Welcome from "./Welcome";

export default function Dashboard () {
    const dispatch = useDispatch();
    const topics = useSelector(selectTopicIds);

    useEffect(() => {
        dispatch(setTopics(data))
    });

    return <HashRouter>
        { (topics.length) ?
        <div className="row">
            <div className="col-3">
                <h3>Topics</h3>
                <TopicMenu />
            </div>
            <div className="col-9">
                <Routes>
                    <Route exact path="/" element={Welcome} />
                    <Route path="/:id" element={<Topic />} />
                </Routes>
            </div>
        </div> : null}
    </HashRouter>;
}
