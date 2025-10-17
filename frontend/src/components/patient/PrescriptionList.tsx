import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { PrescriptionForm } from './PrescriptionForm';
import { Table } from '../common/Table';
import type { Prescription, UpdatePrescriptionDTO } from '../../types/patient.types';
import { formatDate } from '../../utils/formatters';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onUpdate: (id: string, data: UpdatePrescriptionDTO) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canEdit?: boolean;
  showActiveOnly?: boolean;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onUpdate,
  onDelete,
  canEdit = false,
  showActiveOnly = false,
}) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: UpdatePrescriptionDTO) => {
    if (selectedPrescription) {
      await onUpdate(selectedPrescription._id, data);
      setIsEditModalOpen(false);
      setSelectedPrescription(null);
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setDeleteConfirm(null);
  };

  const isActive = (prescription: Prescription) => {
    const now = new Date();
    const startDate = new Date(prescription.startDate);
    const endDate = prescription.endDate ? new Date(prescription.endDate) : null;

    return startDate <= now && (!endDate || endDate >= now);
  };

  const columns = [
    {
      header: 'Medication',
      accessor: 'medicationName' as keyof Prescription,
    },
    {
      header: 'Dosage',
      accessor: 'dosage' as keyof Prescription,
    },
    {
      header: 'Frequency',
      accessor: 'frequency' as keyof Prescription,
    },
    {
      header: 'Start Date',
      accessor: (row: Prescription) => formatDate(row.startDate),
    },
    {
      header: 'End Date',
      accessor: (row: Prescription) => formatDate(row.endDate),
    },
    {
      header: 'Status',
      accessor: (row: Prescription) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive(row)
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive(row) ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    ...(canEdit
      ? [
          {
            header: 'Actions',
            accessor: (row: Prescription) => (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedRow(expandedRow === row._id ? null : row._id);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(row._id);
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Card title={showActiveOnly ? 'Active Prescriptions' : 'All Prescriptions'}>
        {prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No prescriptions recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            <Table data={prescriptions} columns={columns} />
            
            {/* Expanded Instructions */}
            {prescriptions.map((prescription) => (
              expandedRow === prescription._id && (
                <div key={prescription._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Instructions:</h5>
                  <p className="text-gray-700">{prescription.instructions}</p>
                </div>
              )
            ))}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPrescription(null);
        }}
        title="Edit Prescription"
      >
        {selectedPrescription && (
          <PrescriptionForm
            prescription={selectedPrescription}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPrescription(null);
            }}
            isEdit
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this prescription? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};