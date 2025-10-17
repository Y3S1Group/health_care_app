import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { DiagnosisForm } from './DiagnosisForm';
import { Table } from '../common/Table';
import type { Diagnosis, UpdateDiagnosisDTO } from '../../types/patient.types';
import { formatDate } from '../../utils/formatters';

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  onUpdate: (id: string, data: UpdateDiagnosisDTO) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canEdit?: boolean;
}

export const DiagnosisList: React.FC<DiagnosisListProps> = ({
  diagnoses,
  onUpdate,
  onDelete,
  canEdit = false,
}) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: UpdateDiagnosisDTO) => {
    if (selectedDiagnosis) {
      await onUpdate(selectedDiagnosis._id, data);
      setIsEditModalOpen(false);
      setSelectedDiagnosis(null);
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setDeleteConfirm(null);
  };

  const columns = [
    {
      header: 'Date',
      accessor: (row: Diagnosis) => formatDate(row.diagnosisDate),
    },
    {
      header: 'Description',
      accessor: 'description' as keyof Diagnosis,
    },
    ...(canEdit
      ? [
          {
            header: 'Actions',
            accessor: (row: Diagnosis) => (
              <div className="flex gap-2">
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
      <Card title="Diagnoses">
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No diagnoses recorded yet
          </div>
        ) : (
          <Table data={diagnoses} columns={columns} />
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDiagnosis(null);
        }}
        title="Edit Diagnosis"
      >
        {selectedDiagnosis && (
          <DiagnosisForm
            diagnosis={selectedDiagnosis}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedDiagnosis(null);
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
            Are you sure you want to delete this diagnosis? This action cannot be undone.
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