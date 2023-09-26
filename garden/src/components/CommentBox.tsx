import React from "react";
import { useState } from "react";

const CommentBox = ({ comment }: { comment: any }) => {
  const [votes, setVotes] = useState(comment.upvotes - comment.downvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [replies, setReplies] = useState(0);

  const upVote = () => {
    if (!isUpvoted) {
      if (isDownvoted) {
        setVotes(votes + 2);
      } else {
        setVotes(votes + 1);
      }
      setIsUpvoted(true);
      setIsDownvoted(false);
    } else {
      setVotes(votes - 1);
      setIsUpvoted(false);
    }
  };

  const downVote = () => {
    if (!isDownvoted) {
      if (isUpvoted) {
        setVotes(votes - 2);
      } else {
        setVotes(votes - 1);
      }
      setIsDownvoted(true);
      setIsUpvoted(false);
    } else {
      setVotes(votes + 1);
      setIsDownvoted(false);
    }
  };

  const loadReplies = () => {
    if (replies === 0) {
      setReplies(replies + 3);
    }
  };

  return (
    <div>
      <div className="mt-6 h-full w-full shadow-lg bg-gray-200">
        <div className="flex flex-col gap-1 max-w-6 pl-4 pt-4 float-left">
          <button onClick={upVote}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={isUpvoted === true ? 3 : 1.5}
              stroke="currentColor"
              className="w-6 h-6 m-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
          </button>
          <span>{votes}</span>
          <button onClick={downVote}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={isDownvoted === true ? 3 : 1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 ml-16 pl-6 pt-2 bg-white h-fit relative">
          <div className="pb-2 flex items-center gap-3">
            <section className="border border-1 border-black w-max px-3 rounded-2xl">
              {comment.type}
            </section>
            <p className="text-gray-500">Posted by {comment.user}</p>
          </div>
          <div className="h-fit overflow-y-hidden pb-4">
            <h1 className="font-semibold text-xl pb-0.5">{comment.title}</h1>
            <p>{comment.body}</p>
          </div>

          <div className=" pb-2">
            <button
              className="flex items-center justify-center gap-1"
              onClick={loadReplies}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <p className="pl-2">{comment.replies.length} Replies</p>
            </button>
          </div>
        </div>

        <div className="ml-16 pl-6 pt-2 bg-white">
          {comment.replies
            .filter((reply: any, index: any) => {
              if (index < replies) {
                return true;
              }
              return false;
            })
            .map((reply: any) => {
              return (
                <div key={reply.body} className="">
                  <p className="font-semibold">{reply.user}</p>
                  <p className="pb-2">{reply.body}</p>
                </div>
              );
            })}
          {replies > 0 ? (
            <div className="pt-4">
              <button
                className="mr-6 text-blue hover:underline"
                onClick={() => setReplies(replies + 3)}
              >
                Load more replies
              </button>
              <button
                className="text-blue hover:underline"
                onClick={() => setReplies(0)}
              >
                Hide replies
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
