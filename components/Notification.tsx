// components/NotificationsDropdown.tsx
import React from 'react';

const NotificationsDropdown: React.FC = () => {
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New sale recorded' },
    { id: 2, message: 'Inventory running low' },
    { id: 3, message: 'New user registered' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="p-2 bg-gray-100 rounded">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsDropdown;
