import React from "react"

const CommentBox = ({comment}: {comment: any}) =>{

    
    console.log(comment)

    return (
        <div className="pb-6">
           <p className="font-semibold"> {comment.user}</p>
           <p>{comment.body}</p>
        </div>
    )
}

export default CommentBox