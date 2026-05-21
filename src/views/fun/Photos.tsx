import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useUser } from "../../lib/user";
import { useToast } from "../../lib/toast";

export type PhotoDoc = {
  _id: Id<"photos">;
  author: string;
  url: string | null;
  createdAt: number;
};

async function compressImage(file: File, maxSide = 1080, quality = 0.78): Promise<Blob> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas ctx unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality
    );
  });
}

export function Photos({
  unlocked,
  onOpen,
}: {
  unlocked: boolean;
  onOpen: (p: PhotoDoc) => void;
}) {
  const { user } = useUser();
  const toast = useToast();
  const photos = (useQuery(api.photos.list) ?? []) as PhotoDoc[];
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const registerUpload = useMutation(api.photos.registerUpload);
  const remove = useMutation(api.photos.remove);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const myPhotos = photos.filter((p) => p.author === user);
  const limit = myPhotos.length >= 8;

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const blob = await compressImage(file);
      const url = (await generateUploadUrl({})) as string;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });
      if (!res.ok) throw new Error("upload failed");
      const { storageId } = (await res.json()) as { storageId: string };
      await registerUpload({ storageId: storageId as Id<"_storage">, author: user });
      toast("Photo ajoutée");
    } catch (e) {
      console.warn(e);
      toast("Erreur · photo non ajoutée");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fun-section">
      <div className="fun-section-head">
        <div className="fun-section-title">
          Les <em>photos</em>
        </div>
        <div className="fun-section-count">
          {myPhotos.length}/8 perso · {photos.length} total
        </div>
      </div>
      <button
        className="photos-add-btn"
        disabled={limit || uploading}
        onClick={() => inputRef.current?.click()}
      >
        📷 {uploading ? "envoi..." : limit ? "limite 8 atteinte" : "ajouter une photo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
          e.target.value = "";
        }}
      />

      {!unlocked ? (
        <div className="photos-locked">
          <div className="photos-locked-icon">🔒</div>
          <div className="photos-locked-title">Galerie verrouillée</div>
          <div className="photos-locked-text">
            Tu peux uploader tes photos dès maintenant — {photos.length} déjà postée
            {photos.length > 1 ? "s" : ""} par le groupe.
            <br />
            On les découvre toutes ensemble{" "}
            <strong style={{ color: "var(--ink)" }}>dimanche à midi</strong>.
          </div>
        </div>
      ) : photos.length === 0 ? (
        <div className="photos-locked">
          <div className="photos-locked-icon">📷</div>
          <div className="photos-locked-title">Aucune photo</div>
          <div className="photos-locked-text">Soyez les premiers à en partager une !</div>
        </div>
      ) : (
        <div className="photos-grid">
          {photos.map((p) => (
            <PhotoTile
              key={p._id}
              photo={p}
              isMine={p.author === user}
              onOpen={() => onOpen(p)}
              onDelete={async () => {
                await remove({ id: p._id });
                toast("Photo supprimée");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoTile({
  photo,
  isMine,
  onOpen,
  onDelete,
}: {
  photo: PhotoDoc;
  isMine: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  if (!photo.url) return null;
  return (
    <div className={`photo-tile ${isMine ? "mine" : ""}`} onClick={onOpen}>
      <img src={photo.url} alt="" />
      <div className="photo-tile-author">{photo.author}</div>
      {isMine && (
        <button
          className="photo-tile-del"
          style={{ background: confirming ? "var(--primary)" : undefined }}
          onClick={(e) => {
            e.stopPropagation();
            if (confirming) {
              setConfirming(false);
              onDelete();
            } else {
              setConfirming(true);
              setTimeout(() => setConfirming(false), 3000);
            }
          }}
        >
          {confirming ? "?" : "×"}
        </button>
      )}
    </div>
  );
}
