import React, { useRef, useCallback } from 'react';
import { CameraIcon, UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const browseInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
     // Reset value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleBrowseClick = () => {
    browseInputRef.current?.click();
  };
  
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <div>
      <input
        type="file"
        ref={browseInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="user"
      />
      <label 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full max-w-lg mx-auto cursor-default flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-primary hover:bg-brand-light transition-all duration-300"
      >
        <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-semibold">Drag & drop your image here</p>
        <p className="text-gray-500 text-sm my-2">or</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
           <button type="button" onClick={handleBrowseClick} className="px-5 py-2.5 bg-brand-primary text-white font-semibold rounded-lg shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary flex items-center justify-center gap-2">
              <UploadIcon className="h-5 w-5" />
              Browse File
           </button>
           <button type="button" onClick={handleCameraClick} className="px-5 py-2.5 bg-gray-700 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex items-center justify-center gap-2">
              <CameraIcon className="h-5 w-5" />
              Take Photo
           </button>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;