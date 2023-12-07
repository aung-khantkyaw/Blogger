import { useForm } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    

    try {
      const response = await axios.get(
        `http://localhost:3001/users?email=${data.email}&password=${data.password}`
      );
      if (response.data.length === 1) {
        onLogin(response.data[0]);
        alert("Login successful!");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card p-3 login">
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12">
            <label className="form-label">Email:</label>
            <input
              name="email"
              type="email"
              className="form-control"
              {...register("email", { required: true })}
            />
            {errors.email && <span>Email is required</span>}
          </div>
          <div className="col-12">
            <label className="form-label">Password:</label>
            <input
              name="password"
              type="password"
              className="form-control"
              {...register("password", { required: true })}
            />
            {errors.password && <span>Password is required</span>}
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
