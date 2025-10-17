import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';

interface Hospital {
  id: string;
  name: string;
  address: string;
  icon?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  initial: string;
  color: string;
  hospitalId: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentData {
  hospital: Hospital | null;
  doctor: Doctor | null;
  date: Date | null;
  time: string | null;
}

/**
 * UC04 Screen 3: Book Appointment
 * User Action: Searches for available appointment slots
 * System Response: Shows calendar with doctor availability
 * SOLID: Single Responsibility - Appointment booking only
 */
export const BookAppointmentScreen: React.FC = () => {
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    hospital: null,
    doctor: null,
    date: null,
    time: null
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 5)); // June 2023

  // Mock Data
  const hospitals: Hospital[] = [
    { id: '1', name: 'City General Hospital', address: '123 Medical Drive, Downtown' },
    { id: '2', name: 'Metropolitan Medical Center', address: '256 Health Blvd, Midtown' },
    { id: '3', name: 'Regional Health Clinic', address: '789 Wellness Ave, Uptown' }
  ];

  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology Specialist', initial: 'SJ', color: 'bg-blue-500', hospitalId: '1' },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'General Practitioner', initial: 'MC', color: 'bg-blue-500', hospitalId: '2' },
    { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics Specialist', initial: 'ER', color: 'bg-blue-500', hospitalId: '3' },
    { id: '4', name: 'Dr. James Wilson', specialization: 'Orthopedics Surgeon', initial: 'JW', color: 'bg-blue-500', hospitalId: '1' }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: true },
    { time: '3:00 PM', available: true }
  ];

  const filteredDoctors = appointmentData.hospital
    ? doctors.filter(d => d.hospitalId === appointmentData.hospital!.id)
    : [];

  const gridColsClass =
    step === 1 ? 'md:grid-cols-1' : step === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleSelectHospital = (hospital: Hospital) => {
    // reset downstream selections when hospital changes
    setAppointmentData(prev => ({
      ...prev,
      hospital,
      doctor: null,
      date: null,
      time: null
    }));
    setStep(2);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setAppointmentData(prev => ({ ...prev, doctor }));
    setStep(3);
  };


  const handleSelectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setAppointmentData(prev => ({ ...prev, date }));
  };

  const handleSelectTime = (time: string) => {
    setAppointmentData(prev => ({ ...prev, time }));
  };

  const handleConfirmBooking = () => {
    if (
      appointmentData.hospital &&
      appointmentData.doctor &&
      appointmentData.date &&
      appointmentData.time
    ) {
      // Store appointment data and navigate to confirmation
      localStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));
      navigate('appointment-confirmation');
    } else {
      alert('Please select hospital, doctor, date, and time');
    }
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header activeTab="appointments" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">
            Select hospital, doctor, date and time to schedule your appointment
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-4 mb-8">
          {[ { step: 1, label: 'Hospital' }, { step: 2, label: 'Doctor' }, { step: 3, label: 'Date & Time' } ].map(s => (
            <div key={s.step} className={`flex flex-col items-center transition-all ${s.step <= step ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 ${s.step <= step ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}>
                {s.step}
              </div>
              <span className="text-sm font-medium text-gray-700">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {/* Step 1: Select Hospital */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              </svg>
              Select Hospital
            </h3>
            <div className="space-y-3">
              {hospitals.map(hospital => (
                <Card
                  key={hospital.id}
                  selected={appointmentData.hospital?.id === hospital.id}
                  onClick={() => handleSelectHospital(hospital)}
                  className={`cursor-pointer transition-all ${appointmentData.hospital?.id === hospital.id ? 'ring-2 ring-blue-500' : ''}`}
                  icon={
                    <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                  }
                >
                  <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                  <p className="text-sm text-gray-600">{hospital.address}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2: Select Doctor */}
          {appointmentData.hospital && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Select Doctor
              </h3>

              <div className="space-y-3">
                {filteredDoctors.length === 0 ? (
                  <Card className="p-6">
                    <p className="text-sm text-gray-600">No doctors available for this hospital.</p>
                  </Card>
                ) : (
                  filteredDoctors.map(doctor => (
                    <Card
                      key={doctor.id}
                      selected={appointmentData.doctor?.id === doctor.id}
                      onClick={() => handleSelectDoctor(doctor)}
                      className={`cursor-pointer transition-all ${appointmentData.doctor?.id === doctor.id ? 'ring-2 ring-blue-500' : ''}`}
                      icon={
                        <div className={`${doctor.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                          {doctor.initial}
                        </div>
                      }
                    >
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {appointmentData.doctor && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                </svg>
                Select Date & Time
              </h3>

            {/* Calendar */}
            <Card className="mb-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <h4 className="font-semibold text-gray-900">{monthName}</h4>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>
                  </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-600 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {calendarDays.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => day && handleSelectDate(day)}
                        disabled={!day}
                        className={`p-2 rounded font-medium transition-all ${!day ? 'text-gray-300 cursor-not-allowed' : appointmentData.date?.getDate() === day ? 'bg-blue-500 text-white font-bold shadow-md' : 'text-gray-700 hover:bg-blue-50 border border-gray-200'}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
              </div>
            </Card>

            {/* Time Slots */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Available Time Slots</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => slot.available && handleSelectTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-2 rounded text-sm font-medium transition-all ${appointmentData.time === slot.time ? 'bg-blue-500 text-white shadow-md' : slot.available ? 'bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-500 hover:bg-blue-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                {/* Confirm Button */}
                <Button
                  className="w-full"
                  onClick={handleConfirmBooking}
                  disabled={!appointmentData.hospital || !appointmentData.doctor || !appointmentData.date || !appointmentData.time}
                  variant="primary"
                >
                  ✓ Confirm Booking
                </Button>
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};