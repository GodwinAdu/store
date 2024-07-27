// AccountPendingApproval.tsx
import React from 'react';

const page: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Pending Approval</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully, but it needs to be approved by an admin before you can access the platform. Please check your email for updates.
        </p>
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" // Replace with your desired image URL
            alt="Pending Approval"
            className="w-32 h-32 mb-4 rounded-full"
          />
        </div>
        <div className="text-gray-600">
          If you have any questions, please contact support at <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a>.
        </div>
      </div>
    </div>
  );
}

export default page;
