import { useForm } from "react-hook-form";

import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Check if the passwords match
      if (data.password !== data.confirmPassword) {
        alert("Passwords don't match");
        return;
      }

      // data.name modify without space, capital letter and add random number to make unique id
      const id = data.name
        .split(" ")
        .join("")
        .toLowerCase()
        .concat(Math.floor(Math.random() * 1000));

      // Check if the email already exists
      const emailResponse = await axios.get(
        `http://localhost:3001/users?email=${data.email}`
      );
      if (emailResponse.data.length > 0) {
        alert("Email already exists");
        return;
      }

      // Check profile url is include or not
      if (!data.profile) {
        data.profile = "../assets/logo.gif";
      }

      // Create a user object with the necessary data
      const user = {
        id: id,
        name: data.name,
        profile: data.profile,
        email: data.email,
        phone: data.phone,
        password: data.password,
        registrationDate: new Date().toISOString(),
      };

      // Send a POST request to the server to register the user
      const response = await axios.post("http://localhost:3001/users", user);

      // Check the response status
      if (response.status === 201) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card w-50 p-3">
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Profile Url</label>
            <input
              name="profile"
              className="form-control"
              {...register("profile", { required: "Profile is required" })}
            />
            {errors.profile && (
              <span className="text-danger">{errors.profile.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              type="tel"
              className="form-control"
              {...register("phone", { required: "Email is required" })}
            />
            {errors.phone && (
              <span className="text-danger">{errors.phone.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="form-control"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-danger">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
