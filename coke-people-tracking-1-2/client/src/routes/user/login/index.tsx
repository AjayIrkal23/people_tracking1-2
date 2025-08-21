import React, { useState } from "react";
import { Form, Input, Button, Typography, Layout, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/auth/useAuth";
import axios from "@/api/axios";

const { Title } = Typography;
const { Content } = Layout;

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onFinish = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/user/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(res.data);
      message.success("Login successful");
      navigate("/");
    } catch (error: any) {
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen flex justify-center items-center bg-slate-100">
      <Content>
        <div className="w-96 p-10 bg-white rounded-sm shadow-md mt-28">
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            Login
          </Title>
          <Form
            className="flex flex-col justify-between"
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="w-full"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
