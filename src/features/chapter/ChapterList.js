import React from "react";
import PropTypes from "prop-types";
import Chapter from "./Chapter";

function ChapterList({chapters}) {
    return <div>
        {chapters.map(id => <Chapter key={id} id={id} />)}
    </div>
}

ChapterList.propTypes = {
    chapters: PropTypes.array.isRequired
}

export default ChapterList;