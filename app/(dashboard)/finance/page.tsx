export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Finance</h1>
        <p className="text-lg text-gray-600">
          Manage your practice finances and billing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Revenue Overview
          </h3>
          <p className="text-gray-600">
            Track income and financial performance
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Billing & Invoices
          </h3>
          <p className="text-gray-600">Manage patient billing and payments</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Expense Tracking
          </h3>
          <p className="text-gray-600">Monitor practice expenses and costs</p>
        </div>
      </div>
    </div>
  );
}
