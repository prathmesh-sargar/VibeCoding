import { useState, useEffect } from "react";
import { Table } from "../ui/table";
import { TableBody } from "../ui/table";
import { TableCell } from "../ui/table";
import { TableHead } from "../ui/table";
import { TableHeader } from "../ui/table";
import { TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Sheet } from "../ui/sheet";
import { SheetContent } from "../ui/sheet";
import { SheetHeader } from "../ui/sheet";
import { SheetTitle } from "../ui/sheet";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { CheckCircle, Clipboard, FileText } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WorkspaceTable() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteName, setNoteName] = useState("");
  const [existingNote, setExistingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sheets/solved`);
        if (response.data.success) {
          setQuestions(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch solved questions.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSolvedQuestions();
  }, [userId]);

  const fetchNoteForQuestion = async (noteId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`);
      if (response.data.success) {
        const note = response.data.note;
        setExistingNote(note);
        setNoteName(note.question.title );
        setNoteContent(note.content );
      } else {
        setExistingNote(null);
        setNoteName("");
        setNoteContent("");
      }
    } catch (error) {
      toast.error("Error fetching note.");
      setExistingNote(null);
      setNoteName("");
      setNoteContent("");
    }
  };

  const handleSaveNote = async () => {
    if (!selectedQuestion || !noteContent || !noteName) return;

    try {
      const response = existingNote
        ? await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/update`, {
            noteId:selectedQuestion.note,
            content: noteContent,
          })
        : await axios.post(`${import.meta.env.VITE_API_URL}/api/notes/create`, {
            type: "question",
            question_id: selectedQuestion.questionId,
            content: noteContent,
          });

      if (response.data.success) {
        setExistingNote(response.data.note);
        toast.success(existingNote ? "Note updated successfully!" : "Note created successfully!");
        setSelectedQuestion(null);
      }
    } catch (error) {
      toast.error("Failed to save note.");
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const searchMatch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const difficultyMatch = difficultyFilter ? q.difficulty === difficultyFilter : true;
    return searchMatch && difficultyMatch;
  });

  if (loading) {
    return <p className="text-center text-gray-500">Loading solved questions...</p>;
  }

  return (
    <div className="w-full border rounded-lg shadow-sm my-4 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <label htmlFor="difficultyFilter" className="text-sm font-medium">Filter by Difficulty:</label>
          <select
            id="difficultyFilter"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-1/3">Question Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="flex items-center gap-2">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {q.title}
                  </a>
                </TableCell>
                <TableCell>
                  {q.platform.toLowerCase() === "geeksforgeeks" ? (
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg" alt="GFG" className="w-6 h-6" />
                  ) : (
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-6 h-6" />
                  )}
                </TableCell>
                <TableCell className={
                  q.difficulty === "Hard" ? "text-red-500" :
                  q.difficulty === "Medium" ? "text-yellow-500" :
                  "text-green-500"
                }>
                  {q.difficulty}
                </TableCell>
                <TableCell className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedQuestion(q);
                      if (q.note) {
                        fetchNoteForQuestion(q.note);
                      } else {
                        setExistingNote(null);
                        setNoteName(q.title || "Untitled");
                        setNoteContent("");
                      }
                    }}
                  >
                    <Clipboard className={`w-5 h-5 ${q.note ? "text-yellow-500" : "text-gray-500"}`} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center text-gray-500 py-4">
                No solved questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Sheet open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <SheetContent side="right" className="w-screen max-w-[75vw]">
          <SheetHeader>
            <SheetTitle>{selectedQuestion?.title}</SheetTitle>
          </SheetHeader>

          <Card className="flex-grow p-3 flex flex-col gap-3 min-h-96 overflow-auto">
            <div className="flex justify-end gap-2">
              <Button onClick={handleSaveNote}>{existingNote ? "Save" : "Create"}</Button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="noteName" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Note Name:
                </label>
                <Input
                  id="noteName"
                  placeholder="Untitled"
                  maxLength={80}
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                />
              </div>
            </div>
            <Editor
              apiKey="06uys0mqhocineaoxtq8561s3od7hzci5bp9wjn4fzu2scdu"
              value={noteContent}
              onEditorChange={(content) => setNoteContent(content)}
              init={{
                height: 400,
                min_height: 300,
                resize: false,
                menubar: false,
                plugins: "lists link image table code help wordcount",
                toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image | code",
                content_style: "body { font-family: Arial, sans-serif; font-size: 14px; }",
              }}
            />
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
}
