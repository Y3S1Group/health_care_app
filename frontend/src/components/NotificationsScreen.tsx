import React from 'react';
import { Card } from '../components/common/Card';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
interface Notification {
  id: string;
  type: 'appointment' | 'reminder' | 'result';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * UC04 Screen 5: Notifications
 * User Action: Receives appointment reminders via portal
 * System Response: Sends timely alerts and preparation instructions
 */
export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Sarah Johnson has been confirmed for June 7, 2024 at 10:00 AM',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'Your appointment is coming up tomorrow. Please arrive 15 minutes early.',
      time: '1 day ago',
      read: false
    },
    {
      id: '3',
      type: 'result',
      title: 'Lab Results Available',
      message: 'Your recent blood test results are now available. Please review them in your medical records.',
      time: '3 days ago',
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'reminder':
        return '⏰';
      case 'result':
        return '📋';
      default:
        return '📢';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Notifications" subtitle="Stay updated with your health journey" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${!notification.read ? 'border-teal-500 bg-teal-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                </div>
                {!notification.read && (
                  <Button
                    onClick={() => markAsRead(notification.id)}
                    variant="secondary"
                    className="text-sm ml-4"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};