// app/auth/signin/page.js
"use client";
// app/auth/signin/page.js
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      router.push("/admin");
    } else {
      alert("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Sign In
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
