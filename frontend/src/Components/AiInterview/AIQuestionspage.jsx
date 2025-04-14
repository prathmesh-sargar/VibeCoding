import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import { RiSpeakAiFill, RiQuestionLine } from "react-icons/ri";
import { setSingleInterview } from "../../Features/Auth/interviewSlice";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import SpeechRecognition, {
    useSpeechRecognition
} from "react-speech-recognition";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AIInterviewPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { interviewId } = useParams();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [socketInstance, setSocketInstance] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warningCount, setWarningCount] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);

    // New state for storing all metrics data
    const [allMetricsData, setAllMetricsData] = useState([]);

    const { transcript, resetTranscript, listening } = useSpeechRecognition();
    const interview = useSelector((state) => state.interview.singleInterview);
    const questions = interview?.questions || [];
    const currentQuestion = questions[currentIndex] || {
        _id: '',
        questionText: 'Loading question...',
        category: 'General',
        userAnswer: ''
    };

    const [metricsHistory, setMetricsHistory] = useState([]);
    const [averageMetrics, setAverageMetrics] = useState({
        confidence: 0,
        eyeContact: 0
    });
    const [totalFaces, setTotalFaces] = useState(0);
    const [warnings, setWarnings] = useState([]);

    // Fullscreen handling
    const enterFullscreen = useCallback(() => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => setIsFullscreen(true));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen().then(() => setIsFullscreen(true));
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen().then(() => setIsFullscreen(true));
        }
    }, []);

    const exitFullscreen = useCallback(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().then(() => setIsFullscreen(false));
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen().then(() => setIsFullscreen(false));
        }
    }, []);

    // Check fullscreen state
    const checkFullscreen = useCallback(() => {
        setIsFullscreen(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        );
    }, []);

    // Tab switching detection
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            setWarningCount(prev => prev + 1);
            if (warningCount >= 2) {
                setShowWarningModal(true);
                speakText("Warning! Multiple tab switches detected. This may result in interview termination.");
                toast.warn("Multiple tab switches detected!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                speakText(`Warning! Please don't switch tabs. Warning ${warningCount + 1} of 3.`);
                toast.warn(`Please don't switch tabs. Warning ${warningCount + 1} of 3`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        }
    }, [warningCount]);

    // Initialize fullscreen and event listeners
    useEffect(() => {
        enterFullscreen();

        document.addEventListener('fullscreenchange', checkFullscreen);
        document.addEventListener('webkitfullscreenchange', checkFullscreen);
        document.addEventListener('msfullscreenchange', checkFullscreen);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Block context menu
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Block keyboard shortcuts
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
            // Allow only specific keys
            const allowedKeys = [
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Backspace', 'Delete', 'Enter', 'Tab', 'Escape'
            ];
            if (e.altKey && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            exitFullscreen();
            document.removeEventListener('fullscreenchange', checkFullscreen);
            document.removeEventListener('webkitfullscreenchange', checkFullscreen);
            document.removeEventListener('msfullscreenchange', checkFullscreen);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enterFullscreen, exitFullscreen, checkFullscreen, handleVisibilityChange]);

    // Fetch interview data
    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/aiinterview/get/${interviewId}`
                );
                dispatch(setSingleInterview(response.data));
                setLoading(false);
                toast.success("Interview loaded successfully", {
                    position: "top-right",
                    autoClose: 2000,
                });
            } catch (error) {
                console.error("Error fetching interview:", error);
                setLoading(false);
                toast.error("Failed to load interview", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };
        fetchInterview();
    }, [dispatch, interviewId]);

    // Load saved answer when question changes
    useEffect(() => {
        if (currentQuestion?.userAnswer) {
            setUserAnswer(currentQuestion.userAnswer);
        } else {
            setUserAnswer("");
        }
    }, [currentIndex, currentQuestion]);

    // Text-to-speech for questions
    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.cancel();
        synth.speak(utterance);
    };

    useEffect(() => {
        if (currentQuestion?.questionText) {
            setTimeout(() => speakText(currentQuestion.questionText), 1000);
        }
    }, [currentIndex, currentQuestion]);

    // Save answer to backend
    const handleSaveAnswer = async () => {
        if (!userAnswer.trim()) {
            speakText("Please provide an answer before submitting");
            toast.warn("Please provide an answer before submitting", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setSaving(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/aiinterview/${interviewId}/submitAns`,
                {
                    questionId: currentQuestion._id,
                    userAnswer,
                }
            );
            toast.success(response.data.message || "Answer saved successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error saving answer:", error);
            toast.error(error.response?.data?.message || "Failed to save answer. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    // Speech recognition handlers
    const handleStartRecording = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: "en-IN",
            interimResults: true
        });
        toast.info("Recording started", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const handleStopRecording = () => {
        SpeechRecognition.stopListening();
        if (transcript.trim()) {
            setUserAnswer(transcript);
            toast.success("Recording saved to answer field", {
                position: "top-right",
                autoClose: 2000,
            });
        }
        resetTranscript();
    };

    const navigateToScore = async () => {
        // Calculate averages
        const total = allMetricsData.length;
        const totalConfidence = allMetricsData.reduce((sum, item) => sum + item.confidence, 0);
        const totalEyeContact = allMetricsData.reduce((sum, item) => sum + item.eyeContact, 0);

        const avgConfidence = totalConfidence / total;
        const avgEyeContact = totalEyeContact / total;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/aiinterview/expression`,
                {
                    interviewId,
                    confidence: avgConfidence.toFixed(2),
                    eyecontact: avgEyeContact.toFixed(2)
                }
            );
            toast.success(response.data.message || "Interview completed successfully!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error saving metrics:", error);
            toast.error("Failed to save interview metrics", {
                position: "top-center",
                autoClose: 3000,
            });
        }
        speakText("Interview completed. Now showing your results.");
        navigate(`/AI-Interivew/${interviewId}/score`);
    };

    // Draw bounding boxes on canvas
    const drawBoundingBoxes = (faces) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faces.forEach((face) => {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle =  "rgba(74, 222, 128, 0.8)" ;
            ctx.rect(face.x, face.y, face.width, face.height);
            ctx.stroke();

            // Add confidence label
            ctx.fillStyle = "rgba(74, 222, 128, 0.8)" ;
            ctx.font = "bold 14px Arial";
            ctx.fillText(
                `${(face.confidence * 100).toFixed(1)}% ${face.eye_contact ? "👀" : "👁️"}`,
                face.x,
                face.y > 20 ? face.y - 5 : 15
            );
        });
    };

    // Setup socket connection and auto-start monitoring
    useEffect(() => {
        const socket = io("http://localhost:5000", {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        setSocketInstance(socket);

        socket.on("connect", () => {
            console.log("✅ Connected to socket");
            // Auto-start monitoring when connected
            startMonitoring(socket);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from socket");
        });

        socket.on("face_data", (data) => {
            const { faces, total_faces, warnings } = data;
            setTotalFaces(total_faces);
            setWarnings(warnings || []);
            drawBoundingBoxes(faces);

            // Calculate metrics
            const confidences = faces.map((f) => f.confidence * 100);
            const eyeContacts = faces.map((f) => f.eye_contact_percentage);

            const avgConfidence = confidences.length
                ? confidences.reduce((a, b) => a + b) / confidences.length
                : 0;
            const avgEyeContact = eyeContacts.length
                ? eyeContacts.reduce((a, b) => a + b) / eyeContacts.length
                : 0;

            const timestamp = new Date().toISOString();

            // Create detailed metrics object for each face
            const detailedMetrics = faces.map(face => ({
                confidence: face.confidence * 100,
                eyeContact: face.eye_contact_percentage,
                timestamp
            }));

            // Update all metrics data
            setAllMetricsData(prev => [...prev, ...detailedMetrics]);

            // Also update the average metrics for display
            setAverageMetrics({
                confidence: avgConfidence,
                eyeContact: avgEyeContact
            });

            // Update metrics history for the chart
            setMetricsHistory(prev => [
                ...prev.slice(-14),
                {
                    confidence: avgConfidence,
                    eyeContact: avgEyeContact,
                    timestamp
                }
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [currentIndex, currentQuestion]);

    // Start monitoring function
    const startMonitoring = (socket) => {
        const interval = setInterval(() => {
            const webcam = webcamRef.current;
            const canvas = canvasRef.current;

            if (webcam && webcam.video && canvas) {
                canvas.width = webcam.video.videoWidth;
                canvas.height = webcam.video.videoHeight;

                const imageSrc = webcam.getScreenshot();
                if (imageSrc) {
                    socket.emit("video_frame", { image: imageSrc });
                }
            }
        }, 1000); // Send frame every second

        return () => clearInterval(interval);
    };

    if (loading || !interview) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-20 p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-red-600">Warning!</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-700 mb-4">
                            You have switched tabs multiple times during the interview.
                            Continued violations may result in termination of your interview session.
                        </p>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => {
                                    setShowWarningModal(false);
                                    setWarningCount(0);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                I Understand
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Warning */}
            {!isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-blue-600">Fullscreen Required</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                        <p className="text-gray-700 mb-4">
                            The interview must be conducted in fullscreen mode. Please click the button below to continue.
                        </p>
                        <div className="flex justify-end">
                            <Button
                                onClick={enterFullscreen}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Enter Fullscreen
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question Panel */}
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <RiQuestionLine className="text-blue-600 text-xl" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Question {currentIndex + 1} of {questions.length}
                                </h2>
                            </div>
                            <Badge variant="secondary" className="text-sm font-medium">
                                {currentQuestion?.category || "General"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-gray-700 leading-relaxed">
                                {currentQuestion?.questionText || "Loading question..."}
                            </p>
                            <button
                                onClick={() => speakText(currentQuestion?.questionText)}
                                className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                disabled={!currentQuestion?.questionText}
                            >
                                <RiSpeakAiFill className="mr-2" />
                                Hear Question Again
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Answer
                            </label>
                            <textarea
                                value={listening ? transcript : userAnswer}
                                onChange={(e) => !listening && setUserAnswer(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Type or speak your answer here..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={listening ? handleStopRecording : handleStartRecording}
                                variant={listening ? "destructive" : "default"}
                                className="flex-1 gap-2"
                            >
                                {listening ? (
                                    <>
                                        <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
                                        Recording...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                        </svg>
                                        Record Answer
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (listening) handleStopRecording();
                                    setUserAnswer("");
                                }}
                                variant="outline"
                                disabled={!userAnswer && !listening}
                                className="gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Clear
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between gap-4 border-t pt-4">
                        <Button
                            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                            disabled={currentIndex === 0}
                            variant="outline"
                            className="gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Previous
                        </Button>

                        <Button
                            onClick={handleSaveAnswer}
                            disabled={!userAnswer.trim()}
                            className="bg-green-600 hover:bg-green-700 gap-1"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Save Answer
                                </>
                            )}
                        </Button>

                        {currentIndex < questions.length - 1 ? (
                            <Button
                                onClick={() => setCurrentIndex(prev => prev + 1)}
                                disabled={currentIndex >= questions.length - 1}
                                className="gap-1"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        ) : (
                            <Button
                                onClick={navigateToScore}
                                className="bg-purple-600 hover:bg-purple-700 gap-1"
                            >
                                Finish
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Monitoring Panel */}
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Performance Monitoring
                                </h2>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Active
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            />
                        </div>

                        {/* Metrics Overview */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-xs font-medium text-gray-500">Faces</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {totalFaces}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-xs font-medium text-gray-500">Confidence</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {averageMetrics.confidence.toFixed(1)}%
                                </p>
                                <Progress
                                    value={averageMetrics.confidence}
                                    className="h-1.5 mt-2 bg-gray-200"
                                    indicatorColor="bg-blue-500"
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <h3 className="text-xs font-medium text-gray-500">Eye Contact</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {averageMetrics.eyeContact.toFixed(1)}%
                                </p>
                                <Progress
                                    value={averageMetrics.eyeContact}
                                    className="h-1.5 mt-2 bg-gray-200"
                                    indicatorColor="bg-amber-500"
                                />
                            </div>
                        </div>

                        {/* Warnings */}
                        {warnings.length > 0 && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-600 text-sm">
                                    {warnings.map((warning, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{warning}</span>
                                        </div>
                                    ))}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Metrics Charts */}
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metricsHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="timestamp"
                                        tick={{ fontSize: 10 }}
                                        tickMargin={5}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={5}
                                        tickFormatter={(value) => `${value}%`}
                                        width={25}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`]}
                                        labelFormatter={(label) => `Time: ${label}`}
                                        contentStyle={{
                                            fontSize: '12px',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Legend
                                        iconSize={10}
                                        wrapperStyle={{
                                            fontSize: '12px',
                                            paddingTop: '5px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="confidence"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                        name="Confidence"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="eyeContact"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                        name="Eye Contact"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AIInterviewPage;