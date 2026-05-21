import type { PhotoDoc } from "./Photos";

export function PhotoViewer({ photo, onClose }: { photo: PhotoDoc; onClose: () => void }) {
  if (!photo.url) return null;
  return (
    <div
      className="photo-viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="photo-viewer-close" onClick={onClose}>
        ×
      </button>
      <img src={photo.url} alt="" />
      <div className="photo-viewer-info">par {photo.author}</div>
    </div>
  );
}
