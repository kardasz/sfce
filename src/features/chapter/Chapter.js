import React from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {selectChapterById} from "./chapterSlice";
import ReferenceList from "../reference/ReferenceList";

function Chapter({id}) {
    const {title, references} = useSelector(selectChapterById(id))

    return <div className="container">
        <h3>{title}</h3>
        <div className="container">
            <ReferenceList chapterId={id} references={references} />
        </div>
    </div>
}

Chapter.propTypes = {
    id: PropTypes.string.isRequired
}

export default Chapter;
