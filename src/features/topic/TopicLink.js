import React from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {selectTopicById} from "./topicSlice";
import {Link} from "react-router-dom";

function TopicLink({id}) {
    const {title} = useSelector(selectTopicById(id));
    return <Link to={`/${id}`}># {title}</Link>
}

TopicLink.propTypes = {
    id: PropTypes.string.isRequired
}

export default TopicLink;
