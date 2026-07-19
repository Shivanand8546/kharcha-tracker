// SignupPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Returns a score 0-4 based on password characteristics
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(values.password);
  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#f0a5a5", "#f0a5a5", "#f5c97a", "#8fd6a8", "#8fd6a8"];

  const passwordsMatch =
    values.confirmPassword.length > 0 &&
    values.password === values.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = values;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields", toastOptions);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return;
    }

    setLoading(true);

    const { data } = await axios.post(registerAPI, {
      name,
      email,
      password,
    });

    if (data.success === true) {
      delete data.user.password;
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message, toastOptions);
      navigate("/");
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#050608",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 150,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffcc00",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.4,
              random: true,
            },
            size: {
              value: 2,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 1.5,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Container
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <div className="glassCard">
              <div className="authLogoBox">
                <AccountBalanceWalletIcon sx={{ fontSize: 26, color: "#fff" }} />
              </div>
              <h2 className="authTitle">Create account</h2>
              <p className="authSubtitle">Start tracking your expenses</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Label className="authLabel">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={values.name}
                    onChange={handleChange}
                    className="authInput"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="authLabel">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    className="authInput"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="authLabel">Password</Form.Label>
                  <div className="passwordWrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      className="authInput"
                    />
                    <span
                      className="passwordToggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </div>

                  {values.password.length > 0 && (
                    <div className="strengthWrapper">
                      <div className="strengthBar">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="strengthSegment"
                            style={{
                              background:
                                i < strengthScore
                                  ? strengthColors[strengthScore]
                                  : "rgba(255,255,255,0.12)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="strengthLabel"
                        style={{ color: strengthColors[strengthScore] }}
                      >
                        {strengthLabels[strengthScore]}
                      </span>
                    </div>
                  )}
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                  <Form.Label className="authLabel">Confirm password</Form.Label>
                  <div className="passwordWrapper">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className="authInput"
                      style={
                        passwordsMatch
                          ? { borderColor: "rgba(99, 201, 138, 0.5)" }
                          : {}
                      }
                    />
                    {passwordsMatch ? (
                      <span className="passwordToggle matchTick">
                        <CheckCircleIcon sx={{ fontSize: 18, color: "#8fd6a8" }} />
                      </span>
                    ) : (
                      <span
                        className="passwordToggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        )}
                      </span>
                    )}
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="authBtn w-100 mt-4"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign up"}
                </Button>

                <p className="authFooterText mt-3 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="authLink authLinkBold">
                    Login
                  </Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Register;