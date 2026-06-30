const pdfParse = require("pdf-parse")
const {
  generateInterviewReport,
  generateResumePdf
} = require("../services/ai.service")

const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required"
      })
    }

    const resumeContent = await (
      new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer)
      )
    ).getText()

    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi =
      await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
      })

    if (!interViewReportByAi) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate report"
      })
    }

    const interviewReport =
      await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
      })

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      interviewReport
    })

  } catch (err) {
    console.error("INTERVIEW ERROR:", err)

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Interview generation failed"
    })
  }
}

async function getInterviewReportByIdController(
  req,
  res
) {
  const { interviewId } = req.params

  const interviewReport =
    await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id
    })

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found."
    })
  }

  res.status(200).json({
    message:
      "Interview report fetched successfully.",
    interviewReport
  })
}

async function getAllInterviewReportsController(
  req,
  res
) {
  const interviewReports =
    await interviewReportModel.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      )

  res.status(200).json({
    message:
      "Interview reports fetched successfully.",
    interviewReports
  })
}

async function generateResumePdfController(
  req,
  res
) {
  const { interviewReportId } = req.params

  const interviewReport =
    await interviewReportModel.findById(
      interviewReportId
    )

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found."
    })
  }

  const {
    resume,
    jobDescription,
    selfDescription
  } = interviewReport

  const pdfBuffer =
    await generateResumePdf({
      resume,
      jobDescription,
      selfDescription
    })

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition":
      `attachment; filename=resume_${interviewReportId}.pdf`
  })

  res.send(pdfBuffer)
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
}