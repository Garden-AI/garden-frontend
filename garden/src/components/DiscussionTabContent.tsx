import CommentBox from "./CommentBox";
import { useState } from "react";

const DiscussionTabContent = (props: {comments: any; active: string;}) =>{
    const [showComment, setShowComment] = useState(true);
    const commentFilter = () => {
        return props.comments
          .filter((comment: any) => comment.type === "Comment")
          .map((comment: any) => <CommentBox key={comment.body} comment={comment} />);
      };
    
      const questionFilter = () => {
        return props.comments
          .filter((comment: any) => comment.type === "Question")
          .map((comment: any) => <CommentBox key={comment.body} comment={comment} />);
      };

    return (
        <>
    {props.active === "Discussion" && (
              <div className="mx-16">
                <div className="flex pb-6 gap-6">
                  <button
                    className={
                      showComment === true
                        ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl"
                        : "border border-1 border-black w-max px-3 rounded-2xl"
                    }
                    onClick={() => setShowComment(true)}
                  >
                    <p>Comments</p>
                  </button>
                  <button
                    className={
                      showComment === false
                        ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl"
                        : "border border-1 border-black w-max px-3 rounded-2xl"
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
        )
}

export default DiscussionTabContent