import React, { useState } from 'react';
import { Input } from './common/Input';
import { Card } from '../components/common/Card';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

/**
 * UC04 Screen 4: Confirm & Pay
 * User Action: Reviews appointment details and payment
 * System Response: Processes payment and sends confirmation
 */
export const ConfirmPaymentScreen: React.FC = () => {
    const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const appointmentDetails = {
    hospital: 'Metropolitan Medical Center',
    doctor: 'Dr. Sarah Johnson',
    date: 'June 7, 2024',
    time: '10:00 AM',
    fee: '$150.00',
    consultationFee: '$50.00',
    total: '$200.00'
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Payment Successful" subtitle="Appointment confirmed" />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Appointment Confirmed
            </h3>
            <p className="text-center text-gray-600 mb-4">
              A confirmation email has been sent to your inbox.
            </p>
            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p><strong>Doctor:</strong> {appointmentDetails.doctor}</p>
              <p><strong>Date:</strong> {appointmentDetails.date}</p>
              <p><strong>Time:</strong> {appointmentDetails.time}</p>
              <p><strong>Location:</strong> {appointmentDetails.hospital}</p>
            </div>
            <Button className="w-full" onClick={() => navigate('/appointment/dashboard')}>
+              Back to Dashboard
+            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Confirm & Pay" subtitle="Review appointment details and payment" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appointment Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Hospital</span>
                <span className="font-medium text-gray-900">{appointmentDetails.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor</span>
                <span className="font-medium text-gray-900">{appointmentDetails.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium text-gray-900">{appointmentDetails.date} at {appointmentDetails.time}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-medium text-gray-900">{appointmentDetails.consultationFee}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Hospital Fee</span>
                <span className="font-medium text-gray-900">{appointmentDetails.fee}</span>
              </div>
              <div className="flex justify-between pt-4 border-t-2">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-teal-600 text-lg">{appointmentDetails.total}</span>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" fill="currentColor" viewBox="0 0 48 32">
                    <rect fill="#1A1F71" width="48" height="32" rx="4"/>
                    <circle cx="12" cy="16" r="4" fill="#FF5F00"/>
                    <circle cx="36" cy="16" r="4" fill="#EB001B"/>
                  </svg>
                </div>
              </div>

              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={processing}
                variant="primary"
              >
                {processing ? 'Processing Payment...' : `Pay ${appointmentDetails.total}`}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};