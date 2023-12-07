import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const userResponse = await axios.get(
        `http://localhost:3001/users/${userId}`
      );
      const postsResponse = await axios.get(
        `http://localhost:3001/posts?userId=${userId}`
      );

      setUser(userResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:3001/users/${userId}`, updatedUser);
      setIsEditing(false);
      fetchUserProfile(); // Refresh the user data after the update
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const hasPost = posts.length > 0;
  return (
    <div className="container ">
      {user && !isEditing ? (
        <div className="d-flex justify-content-center mb-4">
          <div className="card p-5 col-6">
            <div className=" row">
              <div className="col-4 text-center">
                <img
                  src={user.profile}
                  alt="Profile"
                  className="img-fluid rounded-5"
                />
              </div>
              <div className="col-8">
                <h3 className="fw-bold">{user.name}</h3>
                <p className="lh-1">{user.email}</p>
                <p className="lh-1">{user.phone}</p>
                <p className="lh-1">
                  {new Date(user.registrationDate).toLocaleDateString()}
                </p>
                <button
                  onClick={handleEditProfile}
                  className="btn btn-dark me-2"
                >
                  Edit Profile
                </button>
                <a href="/createPost" className="btn btn-dark">
                  Create Post
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isEditing && (
        <div className="d-flex justify-content-center mb-4">
          <div className="card w-50 p-3">
            <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
              <div className="col-md-6">
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone:</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Profile:</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.profile}
                  onChange={(e) =>
                    setUser({ ...user, profile: e.target.value })
                  }
                />
              </div>

              <div className="col-12 text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSaveProfile(user)}
                >
                  Save
                </button>
                <button
                  className="btn btn-primary ms-3"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container">
        {/* if hasPost show post or not */}
        {hasPost ? (
          <div className="card-list">
            {posts.map((post) => (
              <div className="card-item" key={post.id}>
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
                <h3>{post.title}</h3>
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
    </div>
  );
};

export default UserProfile;
