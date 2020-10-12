import React, {useRef} from "react";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {selectReferenceById, selectReferenceIsReviewedById, setReferenceReviewed} from "./referenceSlice"

function Reference({id}) {
    const dispatch = useDispatch();
    const {title, url} = useSelector(selectReferenceById(id));
    const reviewed = useSelector(selectReferenceIsReviewedById(id))
    const ref = useRef()

    const handleOnReview = () => {
        dispatch(setReferenceReviewed(id, ref.current.checked));
    }

    return <div className="form-group">
        <input type="checkbox" ref={ref} className="form-check-input" onChange={handleOnReview} checked={reviewed} />
        <label className="form-check-label">
            <a href={url} rel="noopener noreferrer"  target="_blank">{title}</a>
        </label>
    </div>;
}

Reference.propTypes = {
    id: PropTypes.string.isRequired
}

export default Reference;
