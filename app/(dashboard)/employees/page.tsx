export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Employees</h1>
        <p className="text-lg text-gray-600">
          Manage your practice staff and team members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Team Overview
          </h3>
          <p className="text-gray-600">
            View all staff members and their roles
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add Employee
          </h3>
          <p className="text-gray-600">Register new team members</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Permissions
          </h3>
          <p className="text-gray-600">Manage access and roles</p>
        </div>
      </div>
    </div>
  );
}
