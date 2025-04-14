import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../Features/Auth/AuthSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";

import { Label } from "../Components/ui/label";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

const SignUp = () => {
    const dispatch = useDispatch();
    const { user, error, loading } = useSelector((state) => state.auth); // Select error state
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        if (user) {
            navigate("/profile/edit"); // Change "/dashboard" to the desired route
        }
    }, [user, navigate]);
    const onSubmit = (data) => {
        dispatch(signupUser(data));
    };

    return (
        <main className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md bg-white/60 dark:bg-gray-900/70 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <CardHeader>
                    <CardTitle className="text-center text-gray-800 dark:text-gray-200 text-2xl font-semibold">
                        Welcome 👋
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Sign up to continue
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                {...register("name", { required: "name is required" })}
                                placeholder="Enter your name"
                                className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                placeholder="Enter your email"
                                className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", { required: "Password is required", minLength: 6 })}
                                placeholder="Enter your password"
                                className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
                            )}
                        </div>

                        {/* Server Error Message */}
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading} // Disable button while loading
                            className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded-md transition-all"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        {/* Sign Up Link */}
                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
};

export default SignUp;
