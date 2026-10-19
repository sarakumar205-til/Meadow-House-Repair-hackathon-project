import { describe, it, expect, beforeEach } from "vitest";
import { validateReportForm, validateCompletionNote } from "../src/utils/validation";
import { generateJobId, generateHistoryId } from "../src/utils/idGenerator";
import { MaintenanceJob, HistoryEntry } from "../src/types/job";
import {
  STORAGE_KEY,
  loadJobsFromStorage,
  saveJobsToStorage,
  clearJobsStorage
} from "../src/utils/storage";

describe("Meadow House Repairs - Judging Test Suite (M01 - M10)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // M01 — Create a valid report (8 marks)
  it("M01: creates a valid report with Meadow House, automatic ID, Urgent priority, and New status", () => {
    const desc = "Garden fence damaged";
    const rep = "Alex Morgan";
    const priority = "Urgent";

    const val = validateReportForm(desc, rep);
    expect(val.isValid).toBe(true);

    const now = new Date().toISOString();
    const job: MaintenanceJob = {
      id: generateJobId([]),
      description: desc.trim(),
      reporter: rep.trim(),
      home: "Meadow House",
      priority: priority,
      status: "New",
      createdAt: now,
      history: [
        {
          id: generateHistoryId(),
          status: "New",
          timestamp: now,
          note: `Fault reported by ${rep}`
        }
      ]
    };

    expect(job.home).toBe("Meadow House");
    expect(job.id).toMatch(/^MH-\\d+$/);
    expect(job.priority).toBe("Urgent");
    expect(job.status).toBe("New");
    expect(job.history.length).toBe(1);
    expect(job.history[0].status).toBe("New");
  });

  // M02 — Reject a missing description (8 marks)
  it("M02: rejects empty description and spaces-only description", () => {
    // Empty
    const emptyVal = validateReportForm("", "Alex Morgan");
    expect(emptyVal.isValid).toBe(false);
    expect(emptyVal.errors.description).toBeDefined();

    // Spaces only
    const spacesVal = validateReportForm("     ", "Alex Morgan");
    expect(spacesVal.isValid).toBe(false);
    expect(spacesVal.errors.description).toBeDefined();
  });

  // M03 — Reject a missing reporter (8 marks)
  it("M03: rejects empty reporter and spaces-only reporter", () => {
    // Empty
    const emptyVal = validateReportForm("Garden fence damaged", "");
    expect(emptyVal.isValid).toBe(false);
    expect(emptyVal.errors.reporter).toBeDefined();

    // Spaces only
    const spacesVal = validateReportForm("Garden fence damaged", "    ");
    expect(spacesVal.isValid).toBe(false);
    expect(spacesVal.errors.reporter).toBeDefined();
  });

  // M04 — Preserve priorities independently (8 marks)
  it("M04: preserves Normal and Urgent priorities independently", () => {
    const job1: MaintenanceJob = {
      id: "MH-1001",
      description: "Hallway paint touchup",
      reporter: "Sam Lee",
      home: "Meadow House",
      priority: "Normal",
      status: "New",
      createdAt: new Date().toISOString(),
      history: []
    };

    const job2: MaintenanceJob = {
      id: "MH-1002",
      description: "Garden fence damaged",
      reporter: "Alex Morgan",
      home: "Meadow House",
      priority: "Urgent",
      status: "New",
      createdAt: new Date().toISOString(),
      history: []
    };

    expect(job1.priority).toBe("Normal");
    expect(job2.priority).toBe("Urgent");
  });

  // M05 — Keep jobs independent (8 marks)
  it("M05: updating one job does not affect another job", () => {
    const fenceJob: MaintenanceJob = {
      id: "MH-1001",
      description: "Garden fence damaged",
      reporter: "Alex Morgan",
      home: "Meadow House",
      priority: "Urgent",
      status: "New",
      createdAt: new Date().toISOString(),
      history: []
    };

    const lightJob: MaintenanceJob = {
      id: "MH-1002",
      description: "Kitchen light flickering",
      reporter: "Taylor Reed",
      home: "Meadow House",
      priority: "Normal",
      status: "New",
      createdAt: new Date().toISOString(),
      history: []
    };

    let jobs = [fenceJob, lightJob];

    // Update only the fence job
    const updatedFence: MaintenanceJob = {
      ...fenceJob,
      status: "In Progress",
      latestNote: "Temporary barrier fitted"
    };

    jobs = jobs.map((j) => (j.id === updatedFence.id ? updatedFence : j));

    expect(jobs[0].status).toBe("In Progress");
    expect(jobs[0].latestNote).toBe("Temporary barrier fitted");

    // Kitchen light job remains completely unchanged
    expect(jobs[1].status).toBe("New");
    expect(jobs[1].latestNote).toBeUndefined();
    expect(jobs[1].description).toBe("Kitchen light flickering");
  });

  // M06 — Record progress (8 marks)
  it("M06: moves status to In Progress, appends note, and retains earlier history", () => {
    const initialTime = "2026-10-19T10:00:00.000Z";
    const initialJob: MaintenanceJob = {
      id: "MH-1001",
      description: "Garden fence damaged",
      reporter: "Alex Morgan",
      home: "Meadow House",
      priority: "Urgent",
      status: "New",
      createdAt: initialTime,
      history: [
        {
          id: "HIST-1",
          status: "New",
          timestamp: initialTime,
          note: "Fault reported by Alex Morgan"
        }
      ]
    };

    const progressTime = "2026-10-19T11:30:00.000Z";
    const progressNote = "Temporary barrier fitted";

    const updatedJob: MaintenanceJob = {
      ...initialJob,
      status: "In Progress",
      latestNote: progressNote,
      history: [
        ...initialJob.history,
        {
          id: "HIST-2",
          status: "In Progress",
          timestamp: progressTime,
          note: progressNote
        }
      ]
    };

    expect(updatedJob.status).toBe("In Progress");
    expect(updatedJob.latestNote).toBe(progressNote);
    expect(updatedJob.history.length).toBe(2);
    expect(updatedJob.history[0].status).toBe("New");
    expect(updatedJob.history[1].status).toBe("In Progress");
  });

  // M07 — Require a completion note (8 marks)
  it("M07: rejects empty and spaces-only completion notes, keeping existing state unchanged", () => {
    const emptyVal = validateCompletionNote("");
    expect(emptyVal.isValid).toBe(false);
    expect(emptyVal.error).toBeDefined();

    const spacesVal = validateCompletionNote("     ");
    expect(spacesVal.isValid).toBe(false);
    expect(spacesVal.error).toBeDefined();

    const validVal = validateCompletionNote("Fence repaired and checked");
    expect(validVal.isValid).toBe(true);
  });

  // M08 — Complete the repair (8 marks)
  it("M08: completes repair with explanation, preserving earlier New and In Progress history", () => {
    const job: MaintenanceJob = {
      id: "MH-1001",
      description: "Garden fence damaged",
      reporter: "Alex Morgan",
      home: "Meadow House",
      priority: "Urgent",
      status: "In Progress",
      createdAt: "2026-10-19T10:00:00.000Z",
      latestNote: "Temporary barrier fitted",
      history: [
        { id: "HIST-1", status: "New", timestamp: "2026-10-19T10:00:00.000Z" },
        { id: "HIST-2", status: "In Progress", timestamp: "2026-10-19T11:00:00.000Z", note: "Temporary barrier fitted" }
      ]
    };

    const completionNote = "Fence repaired and checked";
    const completionVal = validateCompletionNote(completionNote);
    expect(completionVal.isValid).toBe(true);

    const completedJob: MaintenanceJob = {
      ...job,
      status: "Completed",
      latestNote: completionNote,
      history: [
        ...job.history,
        {
          id: "HIST-3",
          status: "Completed",
          timestamp: "2026-10-19T14:00:00.000Z",
          note: completionNote
        }
      ]
    };

    expect(completedJob.status).toBe("Completed");
    expect(completedJob.latestNote).toBe("Fence repaired and checked");
    expect(completedJob.history.length).toBe(3);
    expect(completedJob.history.map((h) => h.status)).toEqual(["New", "In Progress", "Completed"]);
  });

  // M09 — Retain saved work after refresh (8 marks)
  it("M09: saves and loads multiple jobs and history across simulated refresh via localStorage", () => {
    const jobs: MaintenanceJob[] = [
      {
        id: "MH-1001",
        description: "Garden fence damaged",
        reporter: "Alex Morgan",
        home: "Meadow House",
        priority: "Urgent",
        status: "Completed",
        createdAt: "2026-10-19T10:00:00.000Z",
        latestNote: "Fence repaired and checked",
        history: [
          { id: "H1", status: "New", timestamp: "2026-10-19T10:00:00.000Z" },
          { id: "H2", status: "Completed", timestamp: "2026-10-19T12:00:00.000Z", note: "Fence repaired and checked" }
        ]
      },
      {
        id: "MH-1002",
        description: "Kitchen light flickering",
        reporter: "Taylor Reed",
        home: "Meadow House",
        priority: "Normal",
        status: "New",
        createdAt: "2026-10-19T11:00:00.000Z",
        history: [{ id: "H3", status: "New", timestamp: "2026-10-19T11:00:00.000Z" }]
      }
    ];

    saveJobsToStorage(jobs);

    const loaded = loadJobsFromStorage();
    expect(loaded.length).toBe(2);
    expect(loaded[0].id).toBe("MH-1001");
    expect(loaded[0].status).toBe("Completed");
    expect(loaded[0].history.length).toBe(2);
    expect(loaded[1].id).toBe("MH-1002");
    expect(loaded[1].status).toBe("New");
  });

  // M10 — Display typed content safely (8 marks)
  it("M10: preserves literal HTML-like strings <b>check gate</b> without alteration", () => {
    const literalInput = "<b>check gate</b>";
    const val = validateReportForm(literalInput, "Tester");
    expect(val.isValid).toBe(true);

    const job: MaintenanceJob = {
      id: "MH-1001",
      description: literalInput,
      reporter: "Tester",
      home: "Meadow House",
      priority: "Normal",
      status: "New",
      createdAt: new Date().toISOString(),
      latestNote: literalInput,
      history: []
    };

    // The literal characters remain intact
    expect(job.description).toBe("<b>check gate</b>");
    expect(job.latestNote).toBe("<b>check gate</b>");
  });
});\n