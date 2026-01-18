import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import AuthImagePattern from "../components/AuthImagePattern";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { forgotPassword, resetPassword } = useAuthStore();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await forgotPassword({ email });
        setIsLoading(false);
        if (success) setStep(2);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await resetPassword({ email, otp, newPassword });
        setIsLoading(false);
        if (success) {
            navigate("/login");
        }
    };

    return (
        <div className="h-screen grid lg:grid-cols-2">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center p-6 sm:p-12"
            >
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <KeyRound className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">
                                {step === 1 ? "Forgot Password" : "Reset Password"}
                            </h1>
                            <p className="text-base-content/60">
                                {step === 1
                                    ? "Enter your email to receive a password reset code"
                                    : "Enter the code sent to your email and your new password"}
                            </p>
                        </div>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Code"
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">OTP Code</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">New Password</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input input-bordered w-full pl-10"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-base-content/40" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-base-content/40" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Set New Password"
                                )}
                            </motion.button>
                        </form>
                    )}

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="link link-primary flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>

            <AuthImagePattern
                title="Secure Account Recovery"
                subtitle="Reset your password safely to regain access to your account."
            />
        </div>
    );
};

export default ForgotPasswordPage;
