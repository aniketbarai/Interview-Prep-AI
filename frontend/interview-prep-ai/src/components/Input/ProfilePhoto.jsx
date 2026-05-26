import React, { useRef } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhoto = ({
  image,
  setImage,
  preview,
  setPreview,
}) => {
  const inputRef = useRef(null);

  // Open file picker
  const onChooseFile = () => {
    inputRef.current.click();
  };

  // Handle image select
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);

      const previewUrl = URL.createObjectURL(file);

      if (setPreview) {
        setPreview(previewUrl);
      }
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImage(null);

    if (setPreview) {
      setPreview(null);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      
      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* NO IMAGE STATE */}
      {!image ? (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-orange-50 rounded-full cursor-pointer">
          
          <LuUser className="text-4xl text-orange-500" />

          <button
            type="button"
            onClick={onChooseFile}
            className="
              absolute -bottom-1 -right-1
              w-8 h-8
              flex items-center justify-center
              bg-gradient-to-r from-orange-500 to-orange-600
              text-white rounded-full
              shadow-md
              hover:scale-105 transition
            "
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        /* IMAGE PREVIEW */
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          
          <img
            src={preview || ""}
            alt="profile"
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            className="
              absolute -bottom-1 -right-1
              w-8 h-8
              flex items-center justify-center
              bg-red-500 text-white
              rounded-full
              shadow-md
              hover:scale-105 transition
            "
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;