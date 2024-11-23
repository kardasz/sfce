import React from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router";
import {selectTopicById} from "./topicSlice"
import ChapterList from "../chapter/ChapterList";

function Topic() {
    const { id } = useParams();
    const {title, chapters} = useSelector(selectTopicById(id));

    if (!id) {
        return  null;
    }

    return <div className="container">
        <h2># {title}</h2>
        <hr />
        <ChapterList chapters={chapters} />
    </div>;
}

export default Topic;
