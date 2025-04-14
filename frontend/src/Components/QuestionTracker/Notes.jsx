import { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { Button } from "../ui/button";

export default function Notes() {
    const [activeTab, setActiveTab] = useState("general");
    const [noteContent, setNoteContent] = useState("");
    const [noteName, setNoteName] = useState("");
    const [generalNotes, setGeneralNotes] = useState([]);
    const [questionNotes, setQuestionNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [noteType, setNoteType] = useState("general");
    const [questionId, setQuestionId] = useState(null);

    useEffect(() => {
        activeTab === "general" ? fetchGeneralNotes() : fetchQuestionNotes();
    }, [activeTab]);

    const fetchGeneralNotes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/general`);
            setGeneralNotes(response.data.notes);
        } catch (error) {
            console.error("Error fetching general notes:", error);
        }
    };

    const fetchQuestionNotes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/question`);
            setQuestionNotes(response.data.notes);
        } catch (error) {
            console.error("Error fetching question notes:", error);
        }
    };

    const handleNoteClick = (note) => {
        setSelectedNoteId(note.noteId);
        setNoteType(note.question ? "question" : "general");
        setQuestionId(note.question?._id || null);
        setNoteName(note.question ? note.question.title : note.noteName || "Untitled");
        setNoteContent(note.content || note.detail || "");
        setIsEditorOpen(true);
    };

    const handleSave = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;

            const payload = {
                content: noteContent,
                ...(selectedNoteId && { noteId: selectedNoteId }),
                ...(noteType === "question"
                    ? { type: "question", question_id: questionId }
                    : { type: "general", noteName }),
            };

            const endpoint = selectedNoteId
                ? `${baseUrl}/api/notes/update`
                : `${baseUrl}/api/notes/create`;

            const method = selectedNoteId ? "put" : "post";

            await axios[method](endpoint, payload);

            fetchGeneralNotes();
            fetchQuestionNotes();
            setIsEditorOpen(false);
            setSelectedNoteId(null);
            setNoteContent("");
            setNoteName("");
            setQuestionId(null);

            toast.success(selectedNoteId ? "Note updated successfully!" : "Note created successfully!");
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Something went wrong while saving the note.");
        }
    };

    const handleCreateNote = () => {
        setNoteContent("");
        setNoteName("");
        setSelectedNoteId(null);
        setQuestionId(null);
        setNoteType(activeTab);
        setIsEditorOpen(true);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`);
            toast.success("Note deleted successfully!");
            fetchGeneralNotes();
            fetchQuestionNotes();
            if (selectedNoteId === noteId) {
                setIsEditorOpen(false);
                setSelectedNoteId(null);
                setNoteContent("");
                setNoteName("");
                setQuestionId(null);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note.");
        }
    };

    return (
        <div className="w-full p-4 border shadow-sm lg:mb-8 overflow-auto">
            <ToastContainer />
            <section className="flex flex-col gap-4">
                <div className="flex justify-between items-center gap-4">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute w-4 h-4 text-gray-400 right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                        <Input placeholder="Search a note" className="w-full pr-10" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 h-[80vh]">
                    <Card className="p-3">
                        <nav>
                            <div className="flex gap-2">
                                <Button variant={activeTab === "questions" ? "default" : "outline"} className="w-1/2 py-2" onClick={() => setActiveTab("questions")}>Question Notes</Button>
                                <Button variant={activeTab === "general" ? "default" : "outline"} className="w-1/2 py-2" onClick={() => setActiveTab("general")}>General Notes</Button>
                            </div>
                            <div className="my-3 border-t"></div>
                            <div className="p-2 space-y-2">
                                {activeTab === "general" ? (
                                    generalNotes.length > 0 ? (
                                        generalNotes.map((note) => (
                                            <div
                                                key={note.noteId}
                                                className={`p-2 flex justify-between items-center cursor-pointer rounded-md transition-all hover:bg-gray-200 ${
                                                    selectedNoteId === note.noteId ? "bg-gray-300 font-semibold" : ""
                                                }`}
                                            >
                                                <div onClick={() => handleNoteClick(note)} className="flex-1">
                                                    {note.noteName}
                                                </div>
                                                <FiTrash2
                                                    className="text-red-500 hover:text-red-700 cursor-pointer ml-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNote(note.noteId);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500">No Notes Found</div>
                                    )
                                ) : (
                                    questionNotes.length > 0 ? (
                                        questionNotes.map((note) => (
                                            <div
                                                key={note.noteId}
                                                className={`p-2 flex justify-between items-center cursor-pointer rounded-md transition-all hover:bg-gray-200 ${
                                                    selectedNoteId === note.noteId ? "bg-gray-300 font-semibold" : ""
                                                }`}
                                            >
                                                <div onClick={() => handleNoteClick(note)} className="flex-1">
                                                    {note.question.title}
                                                </div>
                                                <FiTrash2
                                                    className="text-red-500 hover:text-red-700 cursor-pointer ml-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNote(note.noteId);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500">No Questions Found</div>
                                    )
                                )}
                            </div>
                        </nav>
                    </Card>
                    <Card className="flex-grow p-4 flex flex-col gap-4 min-h-96 overflow-auto">
                        {isEditorOpen ? (
                            <>
                                <div className="flex justify-end gap-2">
                                    <Button variant="destructive" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSave}>Save</Button>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="noteName" className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-5 h-5" /> Note Name:
                                    </label>
                                    <Input id="noteName" placeholder="Untitled" maxLength={80} value={noteName} onChange={(e) => setNoteName(e.target.value)} disabled={noteType === "question"} />
                                </div>
                                <Editor
                                    apiKey="06uys0mqhocineaoxtq8561s3od7hzci5bp9wjn4fzu2scdu"
                                    value={noteContent}
                                    onEditorChange={(content) => setNoteContent(content)}
                                    init={{
                                        height: "100%",
                                        min_height: 300,
                                        menubar: false,
                                        plugins: "lists link image table code help wordcount",
                                        toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image | code",
                                        content_style: "body { font-family: Arial, sans-serif; font-size: 14px; }"
                                    }}
                                />
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <Button onClick={handleCreateNote} className="px-6 py-3 text-lg">Create Note</Button>
                            </div>
                        )}
                    </Card>
                </div>
            </section>
        </div>
    );
}