import React from "react";
import PropTypes from "prop-types";
import Reference from "./Reference";

function ReferenceList({references}) {
    return <div>
        {references.map((id) => <Reference key={id} id={id} />)}
    </div>;
}

ReferenceList.propTypes = {
    references: PropTypes.array.isRequired
}

export default ReferenceList;
