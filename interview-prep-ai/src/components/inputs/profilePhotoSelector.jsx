import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash2 } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(preview || null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (setPreview) setPreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
  };

  const openFilePicker = () => inputRef.current.click();

  return (
    <div className="relative flex justify-center mb-6">

      {/* Profile Circle */}
      <div
        className="w-24 h-24 rounded-full bg-[#FDF2E9] flex items-center justify-center cursor-pointer overflow-hidden border border-[#F5D8B5]"
        onClick={!previewUrl ? openFilePicker : undefined}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <LuUser size={32} className="text-[#F57C00]" />
        )}
      </div>

      {/* Upload Button (only shown before image upload) */}
      {!previewUrl && (
        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-0 right-[calc(50%-48px)] w-9 h-9 rounded-full bg-[#F57C00] text-white flex items-center justify-center shadow-md hover:bg-[#e76d00] transition"
        >
          <LuUpload size={18} />
        </button>
      )}

      {/* Delete Button (only shown after image upload) */}
      {previewUrl && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute bottom-0 right-[calc(50%-48px)] w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
        >
          <LuTrash2 size={18} />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePhotoSelector;