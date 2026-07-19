// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    setLoading(true);

    const { data } = await axios.post(loginAPI, {
      email,
      password,
    });

    if (data.success === true) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
      toast.success(data.message, toastOptions);
      setLoading(false);
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

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
              <h2 className="authTitle">Welcome back</h2>
              <p className="authSubtitle">Sign in to continue</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="authLabel">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
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
                      onChange={handleChange}
                      value={values.password}
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
                </Form.Group>

                <div className="d-flex justify-content-end mt-2">
                  <Link to="/forgotPassword" className="authLink">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="authBtn w-100 mt-3"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <p className="authFooterText mt-3 text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="authLink authLinkBold">
                    Register
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

export default Login;