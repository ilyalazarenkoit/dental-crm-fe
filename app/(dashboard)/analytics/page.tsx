export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          View your practice analytics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Patient Growth
          </h3>
          <p className="text-gray-600">
            Track patient acquisition and retention
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Revenue Analytics
          </h3>
          <p className="text-gray-600">Monitor financial performance</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Appointment Metrics
          </h3>
          <p className="text-gray-600">Analyze scheduling efficiency</p>
        </div>
      </div>
    </div>
  );
}
