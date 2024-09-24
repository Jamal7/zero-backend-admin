import { useState } from "react";

export default function NewUserModal({ onClose, onCreate }) {
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    status: "active", // Default status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Post the new user data to the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const createdUser = await response.json();
      onCreate(createdUser); // Update the parent component's state with the new user
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={newUser.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
