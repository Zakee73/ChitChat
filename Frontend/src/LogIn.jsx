import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  MessageCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/users/login",
        form,
        {
          withCredentials: true,
        }
      );

      const user = response.data.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message || "Login successful!");

      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <Card className="w-full max-w-sm border-slate-800 bg-slate-900 text-white shadow-2xl">

        <CardHeader className="items-center space-y-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">
            <MessageCircle size={30} />
          </div>

          <CardTitle className="text-3xl font-bold">
            Welcome back!
          </CardTitle>

          <CardDescription className="text-slate-400">
            Login to continue chatting with your friends.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="border-slate-700 bg-slate-950 pl-10 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="border-slate-700 bg-slate-950 pl-10 pr-11 placeholder:text-slate-500"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-sm text-slate-500">
              New to ChitChat?
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-400 hover:underline"
            >
              Sign up
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  );
}

export default Login;