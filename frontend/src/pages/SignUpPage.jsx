import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });

  const { signup, verifyEmail, sendOtp, verifyOtp, isSigningUp } = useAuthStore();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [signupMethod, setSignupMethod] = useState("email");

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");

    if (signupMethod === "email") {
      if (!formData.email.trim()) return toast.error("Email is required");
      if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
      if (!formData.password) return toast.error("Password is required");
      if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    } else {
      if (!formData.phone.trim()) return toast.error("Phone Number is required");
      if (formData.phone.length < 10) return toast.error("Phone number must be at least 10 digits");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    if (signupMethod === "email") {
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      if (success) {
        setShowOtp(true);
        setTimer(300); // Reset timer on successful signup
      }
    } else {
      // Phone Signup
      const success = await sendOtp({
        fullName: formData.fullName,
        phone: formData.phone
      });
      if (success) {
        setShowOtp(true);
        setTimer(300); // Reset timer on successful OTP send
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    if (signupMethod === "email") {
      await verifyEmail({ email: formData.email, otp });
    } else {
      await verifyOtp({ phone: formData.phone, otp });
    }
  };

  const [timer, setTimer] = useState(300);

  const handleResendOtp = async () => {
    if (timer > 0) return;

    // We can re-use the sendOtp function from the store
    // Ensure we are passing correct data based on method
    const promise = signupMethod === "email"
      ? sendOtp({ email: formData.email, fullName: formData.fullName })
      : sendOtp({ phone: formData.phone, fullName: formData.fullName });

    const success = await promise;
    if (success) {
      setTimer(300);
      toast.success("OTP resent successfully");
    }
  };

  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  useEffect(() => {
    if (showOtp) setTimer(300);
  }, [showOtp]);

  if (showOtp) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center p-6 sm:p-12"
        >
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mt-2">Verify Email</h1>
              <p className="text-base-content/60">Enter the 6-digit code sent to {formData.email}</p>
              {timer > 0 ? (
                <p className="text-primary font-semibold mt-2">Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
              ) : (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <p className="text-red-500 font-semibold">OTP Expired</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="btn btn-sm btn-link text-primary"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">OTP Code</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? <Loader2 className="animate-spin" /> : "Verify Email"}
              </button>
              <button
                type="button"
                onClick={() => setShowOtp(false)}
                className="btn btn-ghost w-full"
              >
                Back
              </button>
            </form>
          </div>
        </motion.div>
        {/* Right side */}
        <AuthImagePattern
          title="Verify your account"
          subtitle="We've sent you a code to verify your email address."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center items-center p-6 sm:p-12"
      >
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">



            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Vinayak Chaturvedi"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {signupMethod === "email" ? (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone Number</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}


            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                signupMethod === "email" ? "Create Account" : "Send OTP"
              )}
            </motion.button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline w-full gap-2 transition-colors hover:bg-base-200"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>



          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
