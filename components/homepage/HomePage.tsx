"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CurrencyDollar,
  TrendUp,
  Activity,
  Clock,
  CheckCircle,
  WarningCircle,
} from "phosphor-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CrmPageHeader } from "@/components/navigation";

interface AnalyticsData {
  totalPatients: number;
  activeAppointments: number;
  monthlyRevenue: number;
  patientGrowth: number;
  appointmentCompletion: number;
  averageWaitTime: number;
  pendingTasks: number;
  completedTasks: number;
}

export const HomePage = () => {
  const { t } = useTranslation();
  const [analyticsData] = useState<AnalyticsData>({
    totalPatients: 1247,
    activeAppointments: 23,
    monthlyRevenue: 45680,
    patientGrowth: 12.5,
    appointmentCompletion: 87,
    averageWaitTime: 8,
    pendingTasks: 15,
    completedTasks: 42,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CrmPageHeader
            title={t("homepage.welcome", "Welcome back!")}
            description={t(
              "homepage.subtitle",
              "Here's what's happening with your practice today"
            )}
          />
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t("homepage.total-patients", "Total Patients")}
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalPatients.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +{analyticsData.patientGrowth}%{" "}
                  {t("homepage.from-last-month", "from last month")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Appointments */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t("homepage.active-appointments", "Active Appointments")}
                </CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.activeAppointments}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("homepage.today", "Today")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t("homepage.monthly-revenue", "Monthly Revenue")}
                </CardTitle>
                <CurrencyDollar className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${analyticsData.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +8.2% {t("homepage.from-last-month", "from last month")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Patient Growth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t("homepage.patient-growth", "Patient Growth")}
                </CardTitle>
                <TrendUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  +{analyticsData.patientGrowth}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("homepage.this-month", "This month")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  {t("homepage.performance-metrics", "Performance Metrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appointment Completion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t(
                        "homepage.appointment-completion",
                        "Appointment Completion"
                      )}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {analyticsData.appointmentCompletion}%
                    </span>
                  </div>
                  <Progress
                    value={analyticsData.appointmentCompletion}
                    className="h-2"
                  />
                </div>

                {/* Average Wait Time */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t("homepage.average-wait-time", "Average Wait Time")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {analyticsData.averageWaitTime}{" "}
                      {t("homepage.minutes", "min")}
                    </span>
                  </div>
                  <Progress
                    value={100 - (analyticsData.averageWaitTime / 15) * 100}
                    className="h-2"
                  />
                </div>

                {/* Task Completion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t("homepage.task-completion", "Task Completion")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(
                        (analyticsData.completedTasks /
                          (analyticsData.completedTasks +
                            analyticsData.pendingTasks)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (analyticsData.completedTasks /
                        (analyticsData.completedTasks +
                          analyticsData.pendingTasks)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  {t("homepage.recent-activity", "Recent Activity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Activity Items */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t(
                          "homepage.appointment-completed",
                          "Appointment completed"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t(
                          "homepage.dr-smith-patient-john",
                          "Dr. Smith - Patient John D."
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">2m ago</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t(
                          "homepage.new-patient-registered",
                          "New patient registered"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("homepage.sarah-wilson", "Sarah Wilson")}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">15m ago</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <WarningCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t(
                          "homepage.appointment-reminder",
                          "Appointment reminder sent"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("homepage.tomorrow-10am", "Tomorrow 10:00 AM")}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">1h ago</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t("homepage.payment-received", "Payment received")}
                      </p>
                      <p className="text-xs text-gray-500">
                        $150.00 -{" "}
                        {t("homepage.cleaning-procedure", "Cleaning procedure")}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-gray-900">
                {t("homepage.quick-actions", "Quick Actions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("homepage.schedule-appointment", "Schedule")}
                  </span>
                </button>
                <button className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("homepage.add-patient", "Add Patient")}
                  </span>
                </button>
                <button className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center">
                  <CurrencyDollar className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("homepage.view-reports", "Reports")}
                  </span>
                </button>
                <button className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center">
                  <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("homepage.analytics", "Analytics")}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
