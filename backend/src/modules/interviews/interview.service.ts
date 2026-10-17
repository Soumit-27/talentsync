import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =====================================================
   CREATE INTERVIEW
===================================================== */

export const createInterview = async (
  recruiterId: string,
  applicationId: string,
  scheduledAt: string,
  meetingLink?: string,
  notes?: string
) => {
  const application =
    await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },

      include: {
        job: true,

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
      },
    });

  if (!application) {
    throw new Error("Application not found");
  }

  // Check recruiter owns this job
  if (
    application.job.recruiterId !== recruiterId
  ) {
    throw new Error(
      "You are not authorized to schedule this interview"
    );
  }

  // Check existing interview
  const existingInterview =
    await prisma.interview.findUnique({
      where: {
        applicationId,
      },
    });

  if (existingInterview) {
    throw new Error(
      "Interview already scheduled for this application"
    );
  }

  const interviewDate =
    new Date(scheduledAt);

  if (
    Number.isNaN(
      interviewDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid interview date"
    );
  }

  if (interviewDate <= new Date()) {
    throw new Error(
      "Interview date must be in the future"
    );
  }

  // Transaction
  const interview =
    await prisma.$transaction(
      async (tx) => {
        // Update application status
        await tx.jobApplication.update({
          where: {
            id: applicationId,
          },

          data: {
            status: "INTERVIEW",
          },
        });

        // Create interview
        return tx.interview.create({
          data: {
            applicationId,
            scheduledAt: interviewDate,
            meetingLink,
            notes,
          },

          include: {
            application: {
              include: {
                job: true,

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
              },
            },
          },
        });
      }
    );

  return interview;
};


/* =====================================================
   GET MY INTERVIEWS
   CANDIDATE
===================================================== */

export const getMyInterviews = async (
  userId: string
) => {
  const candidate =
    await prisma.candidateProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!candidate) {
    throw new Error(
      "Candidate profile not found"
    );
  }

  const interviews =
    await prisma.interview.findMany({
      where: {
        application: {
          candidateId: candidate.id,
        },
      },

      include: {
        application: {
          include: {
            job: true,
          },
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

  return interviews;
};


/* =====================================================
   GET RECRUITER INTERVIEWS
===================================================== */

export const getRecruiterInterviews =
  async (recruiterId: string) => {
    const interviews =
      await prisma.interview.findMany({
        where: {
          application: {
            job: {
              recruiterId,
            },
          },
        },

        include: {
          application: {
            include: {
              job: true,

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
            },
          },
        },

        orderBy: {
          scheduledAt: "asc",
        },
      });

    return interviews;
  };


/* =====================================================
   GET SINGLE INTERVIEW
===================================================== */

export const getInterviewById = async (
  recruiterId: string,
  interviewId: string
) => {
  const interview =
    await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },

      include: {
        application: {
          include: {
            job: true,

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
          },
        },
      },
    });

  if (!interview) {
    throw new Error(
      "Interview not found"
    );
  }

  if (
    interview.application.job.recruiterId !==
    recruiterId
  ) {
    throw new Error(
      "You are not authorized to view this interview"
    );
  }

  return interview;
};


/* =====================================================
   UPDATE INTERVIEW
===================================================== */

export const updateInterview = async (
  recruiterId: string,
  interviewId: string,

  data: {
    scheduledAt?: string;
    meetingLink?: string;
    notes?: string;

    status?:
      | "SCHEDULED"
      | "COMPLETED"
      | "CANCELLED";
  }
) => {
  const interview =
    await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },

      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

  if (!interview) {
    throw new Error(
      "Interview not found"
    );
  }

  // Check recruiter ownership
  if (
    interview.application.job.recruiterId !==
    recruiterId
  ) {
    throw new Error(
      "You are not authorized to update this interview"
    );
  }

  const updateData: {
    scheduledAt?: Date;
    meetingLink?: string;
    notes?: string;
    status?:
      | "SCHEDULED"
      | "COMPLETED"
      | "CANCELLED";
  } = {};

  // Update date
  if (
    data.scheduledAt !== undefined
  ) {
    const interviewDate =
      new Date(data.scheduledAt);

    if (
      Number.isNaN(
        interviewDate.getTime()
      )
    ) {
      throw new Error(
        "Invalid interview date"
      );
    }

    if (
      interviewDate <= new Date() &&
      data.status !== "COMPLETED"
    ) {
      throw new Error(
        "Interview date must be in the future"
      );
    }

    updateData.scheduledAt =
      interviewDate;
  }

  // Update meeting link
  if (
    data.meetingLink !== undefined
  ) {
    updateData.meetingLink =
      data.meetingLink;
  }

  // Update notes
  if (
    data.notes !== undefined
  ) {
    updateData.notes = data.notes;
  }

  // Update status
  if (
    data.status !== undefined
  ) {
    updateData.status =
      data.status;
  }

  const updatedInterview =
    await prisma.interview.update({
      where: {
        id: interviewId,
      },

      data: updateData,

      include: {
        application: {
          include: {
            job: true,

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
          },
        },
      },
    });

  return updatedInterview;
};


/* =====================================================
   DELETE INTERVIEW
===================================================== */

export const deleteInterview = async (
  recruiterId: string,
  interviewId: string
) => {
  const interview =
    await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },

      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

  if (!interview) {
    throw new Error(
      "Interview not found"
    );
  }

  // Check recruiter ownership
  if (
    interview.application.job.recruiterId !==
    recruiterId
  ) {
    throw new Error(
      "You are not authorized to delete this interview"
    );
  }

  const deletedInterview =
    await prisma.interview.delete({
      where: {
        id: interviewId,
      },
    });

  return deletedInterview;
};