import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

export default function Login() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  const login = async () => {
    try {
      await axios.post("http://localhost:3000/api/login", {
        user,
        password
      });
      router.push("/backend");
    } catch (error) {
        console.log(error.message)
      setError(true);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p className="text-danger">Login failed</p>}
      <div className="row mt-4">
        <Form>
          <Form.Group className="mb-3" controlId="user">
            <Form.Control
              type="text"
              placeholder="User"
              onChange={(e) => setUser(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={login}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
