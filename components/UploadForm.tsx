"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { checkBookExists, createBook, saveBookSegments } from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

interface VoiceOption {
  id: string;

  name: string;
  description: string;
  group: "Male" | "Female";
}

const voices: VoiceOption[] = [
  { id: "dave", name: "Dave", description: "Clear, friendly male voice", group: "Male" },
  { id: "daniel", name: "Daniel", description: "Professional, steady voice", group: "Male" },
  { id: "chris", name: "Chris", description: "Warm, caring tone", group: "Male" },
  { id: "rachel", name: "Rachel", description: "Articulate, engaging voice", group: "Female" },
  { id: "sarah", name: "Sarah", description: "Warm & approachable tone", group: "Female" },
];

const UploadForm = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("dave");
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAuth();

  const router = useRouter();

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };


  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to submit a book.");
      return;
    }
    setIsLoading(true);

    // Posting -> Track Book Uplaods ....


    try {
      const existsCheck = await checkBookExists(title);

      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with the same title already exists.")

        // Reset form
        setPdfFile(null);
        setCoverImage(null);
        setTitle("");
        setAuthor("");
        setSelectedVoice("dave");

        // Redirect to book page using nextjs router
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }
      const fileTitle = title.replace(/\s+/g, "_").toLowerCase();

      const parsedPDF = await parsePDFFile(pdfFile);

      if (parsedPDF.content.length === 0) {
        toast.error("Failed to parse PDF content. Try again with a different file.");
        setIsLoading(false);
        return;
      }

      const uploadedpdfblob = await upload(fileTitle + ".pdf", pdfFile, {
        access: "public",
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf',
      });


      let coverUrl: string

      if (coverImage) {
        const coverFile = coverImage;
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: coverFile.type,
        })

        coverUrl = uploadedCoverBlob.url;
      } else {
        const response = await fetch(parsedPDF.cover);
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png',
        })
        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title,
        author,
        persona: selectedVoice,
        fileURL: uploadedpdfblob.url,
        fileBlobKey: uploadedpdfblob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile?.size,
      });

      if (!book.success) {
        throw new Error("Failed to create book. Please try again.");
      }

      if (book.alreadyExists) {
        toast.info("Book with the same title already exists.")

        // Reset form
        setPdfFile(null);
        setCoverImage(null);
        setTitle("");
        setAuthor("");
        setSelectedVoice("dave");

        // Redirect to book page using nextjs router
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content);

      if (!segments.success) {
        toast.error("Failed to save book segments. Please try again.");
        setIsLoading(false);
        return;
      }
      setPdfFile(null);
      setCoverImage(null);
      setTitle("");
      setAuthor("");
      setSelectedVoice("dave");

      router.push('/')

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while uploading your book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const maleVoices = voices.filter((v) => v.group === "Male");
  const femaleVoices = voices.filter((v) => v.group === "Female");

  return (
    <div className="new-book-wrapper">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PDF Upload */}
        <div>
          <label className="form-label">Book PDF File</label>
          <div className="upload-dropzone">
            <label className="cursor-pointer block h-full">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center justify-center py-12">
                <Upload className="text-amber-700 mb-3" size={40} />
                <p className="text-center">
                  <span className="font-semibold text-gray-900">Click to upload PDF</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">PDF file (max 50MB)</p>
              </div>
            </label>
          </div>
          {pdfFile && (
            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{pdfFile.name}</span>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="form-label">Cover Image (optional)</label>
          <div className="upload-dropzone">
            <label className="cursor-pointer block h-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="text-amber-700 mb-3" size={40} />
                <p className="text-center">
                  <span className="font-semibold text-gray-900">Click to upload cover image</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">Leave empty to auto-generate from PDF</p>
              </div>
            </label>
          </div>
          {coverImage && (
            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{coverImage.name}</span>
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="ex: Rich Dad Poor Dad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Author Input */}
        <div>
          <label className="form-label">Author Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="ex: Robert Kiyosaki"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Voice Selector */}
        <div>
          <label className="form-label">Choose Assistant Voice</label>

          {/* Male Voices */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Male Voices</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {maleVoices.map((voice) => (
                <label key={voice.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="voice"
                    value={voice.id}
                    checked={selectedVoice === voice.id}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div
                    className={`voice-selector-option ${selectedVoice === voice.id ? "voice-selector-option-selected" : ""
                      }`}
                  >
                    <p className="font-semibold text-gray-900">{voice.name}</p>
                    <p className="text-xs text-gray-600">{voice.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Female Voices */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Female Voices</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {femaleVoices.map((voice) => (
                <label key={voice.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="voice"
                    value={voice.id}
                    checked={selectedVoice === voice.id}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div
                    className={`voice-selector-option ${selectedVoice === voice.id ? "voice-selector-option-selected" : ""
                      }`}
                  >
                    <p className="font-semibold text-gray-900">{voice.name}</p>
                    <p className="text-xs text-gray-600">{voice.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !pdfFile || !title || !author}
          className="form-btn"
        >
          {isLoading ? "Processing..." : "Begin Synthesis"}
        </button>
      </form>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
            <p className="text-gray-900 font-semibold">Processing your book...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;