import { useState, useRef } from "react";
import { Camera, Upload, X, AlertCircle } from "lucide-react";

const MAX_SIZE = 2 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function AvatarUpload({ currentSrc, onUpload, size = 96, name = "User" }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const initial = name.charAt(0).toUpperCase();

  const validate = (file) => {
    if (!file) return "No file selected";
    if (!ACCEPTED.includes(file.type)) return "Only JPEG, PNG, WebP & GIF allowed";
    if (file.size > MAX_SIZE) return "File must be under 2MB";
    return null;
  };

  const handleFile = (file) => {
    setError(null);
    const err = validate(file);
    if (err) { setError(err); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const triggerUpload = async () => {
    if (!selectedFile || !preview) return;
    setUploading(true);
    setError(null);
    try {
      await onUpload(selectedFile, preview);
      setPreview(null);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          width: size, height: size, borderRadius: size / 4, cursor: "pointer", position: "relative", overflow: "hidden", flexShrink: 0,
          background: preview ? `url(${preview}) center/cover no-repeat` : currentSrc ? `url(${currentSrc}) center/cover no-repeat` : "linear-gradient(135deg, #6366f1, #06b6d4)",
          border: dragOver ? "2px dashed #00d4ff" : "2px solid rgba(255,255,255,0.06)",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {!preview && !currentSrc && (
          <span style={{ fontSize: size * 0.4, color: "#fff", fontWeight: 600 }}>{initial}</span>
        )}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: 0, transition: "opacity 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} className="upload-hover">
          <Camera size={size * 0.25} style={{ color: "#fff" }} />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); }} />

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontSize: 11 }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {preview && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setPreview(null); setSelectedFile(null); setError(null); if (fileRef.current) fileRef.current.value = ""; }}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#a1a1aa", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            <X size={12} /> Cancel
          </button>
          <button onClick={triggerUpload} disabled={uploading} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#00d4ff", color: "#020203", cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, opacity: uploading ? 0.6 : 1 }}>
            {uploading ? <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <><Upload size={12} /> Upload</>}
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarUpload;
