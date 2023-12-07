import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const PostResponse = await axios.get("http://localhost:3001/posts");
      setPosts(PostResponse.data.reverse());
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const hasPost = posts.length > 0;
  return (
    <div className="container">
      {/* if hasPost show post or not */}
      {hasPost ? (
       <div className="card-list">
        { posts.map((post) => (
          <div className="card-item" key={post.id}>

            {/* if img include show or not */}
            {post.image_url && (
              <img
                className="card-img-top"
                src={post.image_url}
                alt="Card image cap"
              />
            )}
            <span className="created_by">
              {post.category + " | " + post.userId +
                " | " +
                new Date(post.createdAt).toLocaleDateString()}
            </span>
            <h3 className="fw-bold">{post.title}</h3>
            <p className="card-text mb-auto">
              {post.content.split(" ").slice(0, 10).join(" ")}...
            </p>
            <a href={"/post/" + post.id}>Continue reading</a>
          </div>
        ))}
       </div>
      ) : (
          <div className="text-center">
            <h1>There is no post</h1>
          </div>
      )}
    </div>
  );
}

