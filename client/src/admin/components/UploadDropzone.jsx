import { useRef, useState } from "react";
import { UploadCloud, X, FileVideo, FileImage, RefreshCw } from "lucide-react";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function UploadDropzone({
  accept,
  onChange,
  onDuration, // optional — called with "m:ss" when a video is picked
  label = "Drop file here or click to browse",
  maxMB = 200,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [detectedDuration, setDetectedDuration] = useState("");
  const [fileSize, setFileSize] = useState("");

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    onChange(file);
    setDetectedDuration("");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setPreview({ type: "image", src: e.target.result });
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      // Revoke the previous preview blob (if any) before replacing it
      if (preview?.type === "video") URL.revokeObjectURL(preview.src);
      const objectUrl = URL.createObjectURL(file);
      setPreview({ type: "video", src: objectUrl });

      // Read duration via a hidden video element. The blob URL is shared with
      // the preview above, so it must NOT be revoked here — only in clear().
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.src = objectUrl;

      const reportDuration = () => {
        const secs = Math.floor(vid.duration);
        if (!Number.isFinite(secs) || secs <= 0) return;
        const m = Math.floor(secs / 60);
        const s = String(secs % 60).padStart(2, "0");
        const formatted = `${m}:${s}`;
        setDetectedDuration(formatted);
        onDuration?.(formatted);
      };

      vid.onloadedmetadata = () => {
        if (Number.isFinite(vid.duration) && vid.duration > 0) {
          reportDuration();
        } else {
          // Some MP4/WebM files report Infinity until a seek forces the real
          // duration to be computed (Chrome quirk).
          vid.currentTime = 1e6;
          vid.ontimeupdate = () => {
            vid.ontimeupdate = null;
            vid.currentTime = 0;
            reportDuration();
          };
        }
      };
      vid.onerror = () => {};
    }
  }

  function clear(e) {
    e.stopPropagation();
    if (preview?.type === "video") URL.revokeObjectURL(preview.src);
    setPreview(null);
    setFileName("");
    setFileSize("");
    setDetectedDuration("");
    onChange(null);
    onDuration?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className={`relative rounded-xl transition-colors cursor-pointer
        ${
          dragging
            ? "border-2 border-dashed border-blue-400 bg-blue-50"
            : preview
              ? "border border-slate-200 bg-white hover:border-blue-300"
              : "border-2 border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      aria-label={label}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview ? (
        <div
          className="p-3 sm:p-4 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Large preview stage — dark backdrop for video so letterboxing
              looks intentional; light backdrop for photos. */}
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl h-56 sm:h-80 lg:h-96
              ${preview.type === "video" ? "bg-slate-950" : "bg-slate-100"}`}
          >
            {preview.type === "image" ? (
              <img
                src={preview.src}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={preview.src}
                controls
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full rounded-lg"
              />
            )}
            <button
              type="button"
              onClick={clear}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-lg ring-1 ring-black/5 text-slate-500 hover:text-red-500 hover:bg-white transition"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* File info bar */}
          <div className="flex items-center gap-2.5 mt-3 px-0.5">
            <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-lg bg-blue-50">
              {preview.type === "video" ? (
                <FileVideo className="w-4 h-4 text-blue-500" />
              ) : (
                <FileImage className="w-4 h-4 text-blue-500" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">
                {fileName}
              </p>
              <p className="text-[11px] text-slate-400">
                {[
                  fileSize,
                  preview.type === "video" ? "Video" : "Image",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {detectedDuration && (
                <span className="bg-blue-100 text-blue-700 font-medium text-[11px] px-2 py-0.5 rounded-full">
                  {detectedDuration}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex items-center gap-1 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <RefreshCw className="w-3 h-3" />
                Replace
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <UploadCloud className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">
            Max {maxMB} MB · {accept?.replace(/,/g, ", ")}
          </p>
        </div>
      )}
    </div>
  );
}
