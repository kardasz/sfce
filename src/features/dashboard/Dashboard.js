import React, {useEffect} from "react";
import {Switch, Route, HashRouter} from 'react-router-dom'
import TopicMenu from "../topic/TopicMenu";
import Topic from "../topic/Topic";
import {selectTopicIds, setTopics} from "../topic/topicSlice";
import {data} from "../../data";
import {useDispatch, useSelector} from "react-redux";

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
                <Switch>
                    <Route exact path="/">
                        <h3>
                            This is as simple todo app to help you learning<br/> <a href="https://certification.symfony.com/">Symfony 5.0 certification topics</a>
                        </h3>
                    </Route>
                    <Route path="/:id">
                        <Topic />
                    </Route>
                </Switch>
            </div>
        </div> : null}
    </HashRouter>;
}
