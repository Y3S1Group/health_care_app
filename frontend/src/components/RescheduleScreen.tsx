import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';

interface Appointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

/**
 * UC04 Screen 6: Reschedule/Cancel
 * User Action: Needs to modify appointment due to conflict
 * System Response: Offers flexible rescheduling options
 */
export const RescheduleScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      date: 'June 7, 2024',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      date: 'June 15, 2024',
      time: '2:30 PM',
      status: 'upcoming'
    },
    {
      id: '3',
      doctor: 'Dr. Emily Rodriguez',
      date: 'May 20, 2024',
      time: '11:00 AM',
      status: 'completed'
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleForm(true);
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: 'cancelled' } : a
      ));
      alert('Appointment cancelled successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manage Appointments" subtitle="Reschedule or cancel appointments" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showRescheduleForm ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Appointments</h3>

            {appointments.filter(a => a.status !== 'cancelled').map((appointment) => (
              <Card key={appointment.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                    <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>

                  {appointment.status === 'upcoming' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleReschedule(appointment)}
                      >
                        ↻ Reschedule
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        ✕ Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 mb-4">
              Rescheduling appointment with {selectedAppointment?.doctor}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Time
                </label>
                <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                </select>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  alert('Appointment rescheduled successfully');
                  setShowRescheduleForm(false);
                }}
              >
                Confirm Reschedule
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowRescheduleForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};