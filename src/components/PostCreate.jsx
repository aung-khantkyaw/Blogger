import { useForm } from "react-hook-form";
import axios from "axios";

const PostCreate = () => {
  const User = JSON.parse(localStorage.getItem("user"));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const post = {
        title: data.title,
        category: data.category,
        image_url: data.image_url,
        content: data.body,
        createdAt: new Date().toISOString(),
        userId: User.id,
      };

      const response = await axios.post("http://localhost:3001/posts", post);

      if (response.status === 201) {
        alert("Post Create successful!");
        window.location.href = "/";
      } else {
        alert("Post Create failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Post Create failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card w-50 p-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label className="form-label">Post Title</label>
            <input
              {...register("title", {
                required: "Please fill in this field.",
              })}
              className="form-control"
              aria-invalid={errors["title"] ? "true" : "false"}
              placeholder="post title"
              type="text"
            />
            {errors["title"] && <p role="alert">{errors["title"]?.message}</p>}
          </div>

          <div className="mb-2">
            <label className="form-label">Category</label>
            <select
              {...register("category", {
                required: "Please fill in this field.",
              })}
              className="form-control"
              aria-invalid={errors["category"] ? "true" : "false"}
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="News">News</option>
              <option value="Art">Art</option>
              <option value="Tech">Tech</option>
            </select>
            {errors["category"] && (
              <p role="alert">{errors["category"]?.message}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="form-label">Image Url</label>
            <input
              {...register("image_url")}
              type="url"
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Body</label>
            <textarea
              {...register("body", {
                required: "Please fill in this field.",
              })}
              className="form-control"
              aria-invalid={errors["body"] ? "true" : "false"}
              placeholder="What's on your mind?"
              type="textarea"
              rows={5}
            />
            {errors["body"] && <p role="alert">{errors["body"]?.message}</p>}
          </div>

          <div className="text-center">
          <button className="btn btn-primary">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate;
