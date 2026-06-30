import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)

    const [progress, setProgress] = useState(0)
    const [processingStep, setProcessingStep] = useState("")

    const resumeInputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {

        if (!loading) {
            setProgress(0)
            return
        }

        setProcessingStep("📤 Uploading Resume...")
        setProgress(10)

        const timer1 = setTimeout(() => {
            setProcessingStep("📄 Extracting Resume Content...")
            setProgress(30)
        }, 3000)

        const timer2 = setTimeout(() => {
            setProcessingStep("🎯 Matching Job Description...")
            setProgress(55)
        }, 6000)

        const timer3 = setTimeout(() => {
            setProcessingStep("🤖 Generating Technical Questions...")
            setProgress(75)
        }, 10000)

        const timer4 = setTimeout(() => {
            setProcessingStep("🧠 Generating Behavioural Questions...")
            setProgress(85)
        }, 14000)

        const timer5 = setTimeout(() => {
            setProcessingStep("🛣️ Creating Interview Roadmap...")
            setProgress(95)
        }, 18000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(timer4)
            clearTimeout(timer5)
        }

    }, [loading])

    const handleGenerateReport = async () => {

        const resumeFile =
            resumeInputRef.current?.files?.[0]

        if (!jobDescription.trim()) {
            alert("Please enter Job Description")
            return
        }

        if (!resumeFile && !selfDescription.trim()) {
            alert(
                "Upload Resume OR Enter Self Description"
            )
            return
        }

        try {

            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            navigate(`/interview/${data._id}`)

        } catch (error) {

            console.log(error)

            alert(
                "Something went wrong while generating report."
            )
        }
    }

    return (
        <div className='home-page'>

            {loading && (
                <div className='analysis-overlay'>

                    <div className='analysis-card'>

                        <div className='spinner'></div>

                        <h2>AI Analysis In Progress</h2>

                        <p>{processingStep}</p>

                        <div className='progress-wrapper'>
                            <div
                                className='progress-fill'
                                style={{
                                    width: `${progress}%`
                                }}
                            />
                        </div>

                        <span>{progress}% Completed</span>

                    </div>

                </div>
            )}

            <header className='page-header'>
                <h1>
                    Create Your Custom
                    <span className='highlight'>
                        {" "}Interview Plan
                    </span>
                </h1>

                <p>
                    Let our AI analyze the job requirements
                    and your profile to build a winning strategy.
                </p>
            </header>

            <div className='interview-card'>

                <div className='interview-card__body'>

                    <div className='panel panel--left'>

                        <div className='panel__header'>
                            <h2>Target Job Description</h2>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            className='panel__textarea'
                            placeholder='Paste Job Description Here...'
                        />

                    </div>

                    <div className='panel-divider' />

                    <div className='panel panel--right'>

                        <div className='upload-section'>

                            <label className='section-label'>
                                Upload Resume
                            </label>

                            <label
                                className='dropzone'
                                htmlFor='resume'
                            >

                                <p className='dropzone__title'>
                                    Click To Upload Resume
                                </p>

                                <p className='dropzone__subtitle'>
                                    PDF / DOCX
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    accept='.pdf,.doc,.docx'
                                    onChange={(e) => {
                                        const file =
                                            e.target.files[0]

                                        setSelectedFile(file)
                                    }}
                                />

                            </label>

                            {selectedFile && (

                                <div className='uploaded-file'>

                                    <div>
                                        📄 {selectedFile.name}
                                    </div>

                                    <div>
                                        Size :
                                        {" "}
                                        {
                                            (
                                                selectedFile.size /
                                                1024
                                            ).toFixed(1)
                                        }
                                        {" "}
                                        KB
                                    </div>

                                    <span
                                        className='uploaded-status'
                                    >
                                        ✅ Uploaded Successfully
                                    </span>

                                </div>

                            )}

                        </div>

                        <div className='or-divider'>
                            <span>OR</span>
                        </div>

                        <div className='self-description'>

                            <label
                                className='section-label'
                            >
                                Self Description
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) =>
                                    setSelfDescription(
                                        e.target.value
                                    )
                                }
                                className='panel__textarea panel__textarea--short'
                                placeholder='Describe Yourself...'
                            />

                        </div>

                    </div>

                </div>

                <div className='interview-card__footer'>

                    <span className='footer-info'>
                        AI Powered Analysis
                    </span>

                    <button
                        disabled={loading}
                        onClick={handleGenerateReport}
                        className='generate-btn'
                    >

                        {
                            loading
                                ? "Generating..."
                                : "Generate My Interview Strategy"
                        }

                    </button>

                </div>

            </div>

            {reports.length > 0 && (

                <section className='recent-reports'>

                    <h2>
                        My Recent Interview Plans
                    </h2>

                    <ul className='reports-list'>

                        {
                            reports.map(report => (

                                <li
                                    key={report._id}
                                    className='report-item'
                                    onClick={() =>
                                        navigate(
                                            `/interview/${report._id}`
                                        )
                                    }
                                >

                                    <h3>
                                        {
                                            report.title ||
                                            "Untitled Position"
                                        }
                                    </h3>

                                    <p>
                                        Match Score :
                                        {" "}
                                        {report.matchScore}%
                                    </p>

                                </li>

                            ))
                        }

                    </ul>

                </section>

            )}

        </div>
    )
}

export default Home