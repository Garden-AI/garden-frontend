import CommentBox from "./CommentBox";
import { useState } from "react";

const DiscussionTabContent = (props: { comments: any; active: string }) => {
  const [showComment, setShowComment] = useState(true);
  const commentFilter = () => {
    return props.comments
      .filter((comment: any) => comment.type === "Comment")
      .map((comment: any) => (
        <CommentBox key={comment.body} comment={comment} />
      ));
  };

  const questionFilter = () => {
    return props.comments
      .filter((comment: any) => comment.type === "Question")
      .map((comment: any) => (
        <CommentBox key={comment.body} comment={comment} />
      ));
  };

  return (
    <>
      {props.active === "Discussion" && (
        <div className="mx-16">
          <div className="flex gap-6 pb-6">
            <button
              className={
                showComment === true
                  ? " border-1 w-max rounded-2xl border border-white bg-green px-3 text-white"
                  : "border-1 w-max rounded-2xl border border-black px-3"
              }
              onClick={() => setShowComment(true)}
            >
              <p>Comments</p>
            </button>
            <button
              className={
                showComment === false
                  ? " border-1 w-max rounded-2xl border border-white bg-green px-3 text-white"
                  : "border-1 w-max rounded-2xl border border-black px-3"
              }
              onClick={() => setShowComment(false)}
            >
              <p>Questions</p>
            </button>
          </div>
          {showComment === true ? commentFilter() : questionFilter()}
        </div>
      )}
    </>
  );
};

export default DiscussionTabContent;
