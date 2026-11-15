import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Eye, EyeOff, MessageCircle } from "lucide-react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5 MB.");
        return;
      }

      setError("");
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

  };

  return (
    <>
    
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <Card className="w-full max-w-sm border-slate-800 bg-slate-900 text-white shadow-2xl ">
        <CardHeader className="items-center text-center ">
          <div className=" hidden sm:multi-['flex;h-12;w-12;items-center;justify-center;rounded-2xl;bg-emerald-500 text-slate-950']">
            <MessageCircle size={27} />
          </div>

          <CardTitle className=" sm:multi ['text-3xl;font-bold ;tracking-tight]">
            Create an account
          </CardTitle>

          <CardDescription className="text-slate-400">
            Join ChitChat and start connecting with friends.
          </CardDescription>

          <label className="group relative mt-2 cursor-pointer justify-center items-center flex">
            <Avatar className="h-20 w-20 border-2 border-slate-700">
              <AvatarImage src={preview} />
              <AvatarFallback className="bg-slate-800 text-xl text-slate-300">
                DP
              </AvatarFallback>
            </Avatar>

            <span className="absolute bottom-0 right-32 rounded-full bg-emerald-500 p-2 text-slate-950">
              <Camera size={16} />
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          <p className="text-xs text-slate-400">
            Upload profile picture (optional)
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Your full name"
                value={form.fullname}
                onChange={handleChange}
                required
                autoComplete="name"
                className="border-slate-700 bg-slate-950 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="border-slate-700 bg-slate-950 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="border-slate-700 bg-slate-950 pr-11 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Create Account
            </Button>
          </form>
          <p className="mt-3 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
    </>
  );
}

export default Signup;