import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/constants";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/register`, {
        username,
        email,
        password,
      });
      alert(response.data.msg); // Show a success message
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Registration failed!");
    }
  };

  return (
    <section className="register" style={{ background: "#eee" }}>
      <div className="container pt-4">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>
                    {errorMessage && (
                      <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    <form className="mx-1 mx-md-4">
                      <div className="mb-4">
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          placeholder="Your Name"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Repeat your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="d-flex justify-content-center mb-4">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          onClick={handleRegister}
                        >
                          Register
                        </button>
                      </div>
                      <p className="text-center">
                        Already have an account?{" "}
                        <a href="/login" className="sign-in">
                          Sign In
                        </a>
                      </p>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
