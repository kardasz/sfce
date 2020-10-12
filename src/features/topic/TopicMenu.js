import React from "react";
import {useSelector} from "react-redux";
import TopicLink from "./TopicLink";
import {selectTopicIds} from "./topicSlice";

export default function TopicMenu () {
    const topics = useSelector(selectTopicIds);
    return <ul>{topics.map((id) => <li key={id}><TopicLink id={id} /></li>)}</ul>;
}
