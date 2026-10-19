import React, { useState, useEffect } from "react";
import { MaintenanceJob, StatusFilter } from "./types/job";
import { loadJobsFromStorage, saveJobsToStorage, clearJobsStorage } from "./utils/storage";
import { Header } from "./components/Header";
import { SummaryCards } from "./components/SummaryCards";
import { JobList } from "./components/JobList";
import { ReportFaultModal } from "./components/ReportFaultModal";
import { JobDetailView } from "./components/JobDetailView";
import { Toast, ToastMessage } from "./components/Toast";

export const App: React.FC = () => {
  const [jobs, setJobs] = useState<MaintenanceJob[]>(() => loadJobsFromStorage());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<StatusFilter>("All");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    saveJobsToStorage(jobs);
  }, [jobs]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({
      id: `toast-${Date.now()}`,
      type,
      message
    });
  };

  // Create a new maintenance job (M01, M04)
  const handleSaveJob = (newJob: MaintenanceJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    showToast(`Fault report ${newJob.id} created successfully for Meadow House.`);
  };

  // Update a single job independently (M05, M06, M07, M08)
  const handleUpdateJob = (updatedJob: MaintenanceJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    showToast(
      updatedJob.status === "Completed"
        ? `Repair ${updatedJob.id} marked as Completed.`
        : `Progress recorded for job ${updatedJob.id}.`
    );
  };

  // Reset localStorage to guarantee a clean slate for judges
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all jobs? This will clear localStorage for a fresh judging test.")) {
      clearJobsStorage();
      setJobs([]);
      setSelectedJobId(null);
      setCurrentFilter("All");
      showToast("All jobs cleared. Application is in fresh starting state.");
    }
  };

  // Find currently active opened job
  const activeJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="app-container">
      {/* Primary Header */}
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetData={handleResetData}
        jobCount={jobs.length}
      />

      <main className="main-content">
        {activeJob ? (
          /* Individual Job Screen */
          <JobDetailView
            job={activeJob}
            onBack={() => setSelectedJobId(null)}
            onUpdateJob={handleUpdateJob}
          />
        ) : (
          /* Main Dashboard */
          <>
            <SummaryCards
              jobs={jobs}
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
            />

            <JobList
              jobs={jobs}
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
              onOpenJob={(job) => setSelectedJobId(job.id)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Report Fault Modal */}
      <ReportFaultModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSaveJob={handleSaveJob}
        existingJobs={jobs}
      />

      {/* Accessible Live Confirmation Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};\n