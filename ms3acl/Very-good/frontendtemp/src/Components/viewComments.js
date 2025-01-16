import React from 'react';

const ViewComments = ({ comments }) => {
  return (
    <div className="comments-section">
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((commentObj, index) => (
          <div key={index} className="comment-item">
            <p className="comment-text"><strong>Comment:</strong> {commentObj.comment}</p>
            <p className="comment-tourist">Tourist ID: {commentObj.touristId}</p>
            {/* You could further fetch the tourist details using touristId if needed */}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default ViewComments;
