import { Avatar } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { forwardRef } from "react";
import db from "../firebase";
import './post.css'

const Post = forwardRef(
    ({user, username, postId, imageUrl, caption}, ref) => {
        const [comments, setComments] = useState([]);
        const [comment, setComment] = useState('');

  
        useEffect(() => {
            let unSubscribe;
            if(postId){
                unSubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapShot) => {
                    setComments(snapShot.docs.map((doc) => doc.data()));
                })
            }
            return () => {
                unSubscribe();
            };
        }, [postId])


      const postComment = e => {
          e.preventDefault();
          db.collection("posts").doc(postId).collection("comments").add({
              text: comment,
              username: user.displayName,
          })
          setComment("")
      }  

    return (
        <div className="post" ref={ref}>
          <div className="post_header">
           <Avatar className="post_avatar" alt={username} src="" />
           <h3>{username}</h3>
          </div>
          <img className="post_image" src={imageUrl} alt="post" />
          <h4 className="post_text">
             {username} <span className="post_caption">{caption}</span>
          </h4>
          <div className="post_comments">
              {comments.map((comment) => (
                  <p>
                      <b>{comment.username}</b> {comment.text}
                  </p>
              ))}
          </div>
          {user && (
              <form className="post_commentBox">
                <input 
                  className="post_input"
                  type="text"
                  placeholder="Add a comment.."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                
                />
                <button disabled={!comment}
                 className="post_button"
                 type="submit"
                 onClick={postComment}
                >
                    Post
                </button>
              </form>
          )}
        </div>
    )    
    }
    
)

export default Post