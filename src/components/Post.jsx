import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import bin from "../assets/trash-bin.gif";
import arrow from "../assets/arrow.gif";
import axios from "axios";

const Post = () => {
  const User = JSON.parse(localStorage.getItem("user"));
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    try {
      const PostResponse = await axios.get(
        `http://localhost:3001/posts/${postId}`
      );
      const CommentResponse = await axios.get(
        `http://localhost:3001/comments?postId=${postId}`
      );

      setPosts(PostResponse.data);
      setComments(CommentResponse.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const comment = {
        userId: User.id,
        postId: postId,
        comment: data.comment,
        createdAt: new Date().toISOString(),
      };
      console.log(comment);

      const response = await axios.post(
        "http://localhost:3001/comments",
        comment
      );

      if (response.status === 201) {
        window.location.href = "/post/" + postId;
      } else {
        alert("Comment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Comment failed. Please try again.");
    }
  };

  return (
    <div className="container">
      {/* if post.userid === User.userid show delete button and back button*/}
      {User && posts.userId === User.id && (
        <div className="d-flex justify-content-between mb-3">
            {/* back button */}
          <button
            className="btn btn-outline-info fw-bold text-dark"
            onClick={() => window.history.back()}
          >
            <img src={arrow} className="me-2" alt="bin" width="25" />
            Back
          </button>

          {/* if click button show alert and delete the post */}
          <button
            className="btn btn-outline-secondary fw-bold text-dark"
            onClick={() => {
              if (
                window.confirm("Are you sure you wish to delete this post?")
              ) {
                axios
                  .delete(`http://localhost:3001/posts/${postId}`)
                  .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    window.location.href = "/";
                  });
              }
            }}
          >
            <img src={bin} className="me-2" alt="bin" width="25" />
            Delete
          </button>
        </div>
      )}
      <div className="card p-5 col-12 mb-5">
        <div className=" row">
          <div className="col-12 text-center">
            {/* if img include show or not */}
            {posts.image_url && (
              <img
                className="img-fluid"
                src={posts.image_url}
                alt="Card image cap"
              />
            )}
          </div>
          <div className="col-12">
            <h3 className="fw-bold">{posts.title}</h3>
            <p className="card-text mb-auto">{posts.content}</p>
          </div>
        </div>
      </div>

      <div className="card mb-5">
        <div className="card-body">
          <h5 className="card-title">Comments</h5>
          {/* comment box */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 text-end">
              <textarea
                {...register("comment", {
                  required: "Please fill in this field.",
                })}
                className="form-control"
                aria-invalid={errors["comment"] ? "true" : "false"}
                placeholder="What's on your mind?"
                type="textarea"
              />
              {errors["comment"] && (
                <p role="alert">{errors["comment"]?.message}</p>
              )}
              <button className="btn btn-primary mt-3">Comment</button>
            </div>
          </form>
          <div className="card-text">
            {comments.map((comment) => (
              <div className="card mb-3" key={comment.id}>
                <div className="card-header d-flex justify-content-between">
                  <span>{comment.userId}</span>
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
