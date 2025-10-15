import React from 'react';
import type { ResourceSummary } from '../types';

interface ResourceSummaryCardsProps {
  summary: ResourceSummary;
}

export const ResourceSummaryCards: React.FC<ResourceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Available staff:</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary.staff.available}/{summary.staff.total}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Available Beds:</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary.beds.available}/{summary.beds.total}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white border-l-4 border-orange-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Available Equipment:</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary.equipment.available}/{summary.equipment.total}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};