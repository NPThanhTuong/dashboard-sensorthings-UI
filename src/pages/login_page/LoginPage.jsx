import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setMessage("Đăng nhập thành công!");
      console.log("đăng nhập với người dùng:", user);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
