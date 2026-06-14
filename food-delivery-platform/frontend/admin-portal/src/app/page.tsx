import React from 'react';

/**
 * Dashboard Page.
 * Demonstrates Component Reusability and Clean Architecture.
 */
export default function DashboardPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">System Dashboard</h1>
        <p className="text-gray-500">Overview of platform metrics and recent activities.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">1,240</p>
        </div>
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-semibold">System Health</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">99.9%</p>
        </div>
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-semibold">Pending Alerts</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}
