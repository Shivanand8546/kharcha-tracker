import React from "react";
import "./skeleton.css";

const Skeleton = () => {
  return (
    <div className="skeletonContainer">
      <div className="skeletonSummaryRow">
        <div className="shimmerBox skeletonSummaryCard"></div>
        <div className="shimmerBox skeletonSummaryCard"></div>
        <div className="shimmerBox skeletonSummaryCard"></div>
      </div>

      <div className="shimmerBox skeletonFilterRow"></div>

      <div className="skeletonList">
        {[1, 2, 3, 4].map((i) => (
          <div className="skeletonRow" key={i}>
            <div className="shimmerBox skeletonIcon"></div>
            <div className="skeletonTextGroup">
              <div className="shimmerBox skeletonLineWide"></div>
              <div className="shimmerBox skeletonLineNarrow"></div>
            </div>
            <div className="shimmerBox skeletonAmount"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;