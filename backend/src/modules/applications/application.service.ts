import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createApplication = async (userId: string, jobId: string) => {
  // 1. Find candidate profile
  const candidate = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!candidate) {
    throw new Error("Candidate profile not found");
  }

  // 2. Check job
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // 3. Check job status
  if (job.status !== "OPEN") {
    throw new Error("This job is no longer accepting applications");
  }

  // 4. Check duplicate application
  const existingApplication = await prisma.jobApplication.findUnique({
    where: {
      candidateId_jobId: {
        candidateId: candidate.id,
        jobId,
      },
    },
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  // 5. Create application
  const application = await prisma.jobApplication.create({
    data: {
      candidateId: candidate.id,
      jobId,
      status: "APPLIED",
    },
    include: {
      job: true,
      candidate: true,
    },
  });

  return application;
};

// GET MY APPLICATIONS
export const getMyApplications = async (userId: string) => {
  // 1. Find candidate profile
  const candidate = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!candidate) {
    throw new Error("Candidate profile not found");
  }

  // 2. Find all applications
  const applications = await prisma.jobApplication.findMany({
    where: {
      candidateId: candidate.id,
    },
    include: {
      job: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return applications;
};

export const getRecruiterApplications = async (recruiterId: string) => {
  const applications = await prisma.jobApplication.findMany({
    where: {
      job: {
        recruiterId: recruiterId,
      },
    },

    orderBy: {
      appliedAt: "desc",
    },

    include: {
      candidate: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      job: {
        select: {
          id: true,
          title: true,
          companyName: true,
          location: true,
          jobType: true,
        },
      },
    },
  });

  return applications;
};
