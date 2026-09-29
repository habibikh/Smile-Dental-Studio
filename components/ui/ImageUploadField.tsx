'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertCircle, X, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'wide';
  placeholderSeed?: string;
  helperText?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = 'square',
  placeholderSeed = 'smile-clinic',
  helperText = 'Accepts JPG or PNG files up to 10MB.',
  required = false,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlMode, setShowUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fallbackUrl = aspectRatio === 'square'
    ? `https://picsum.photos/seed/${placeholderSeed}/800/800`
    : `https://picsum.photos/seed/${placeholderSeed}/800/600`;

  const currentPreview = value && (value.startsWith('data:image/') || value.startsWith('http') || value.startsWith('/'))
    ? value
    : fallbackUrl;

  const isDataUrl = value && value.startsWith('data:image/');

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate type (JPG or PNG)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const fileName = file.name.toLowerCase();
    const isExtensionValid = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorMessage('Please upload an image in JPG or PNG format only (.jpg, .jpeg, .png).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Failed to read selected image file.');
    };

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        setErrorMessage('Failed to load image.');
        return;
      }

      // Optimize image through Canvas to keep storage lightweight and responsive
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDimension = aspectRatio === 'square' ? 900 : 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const optimizedDataUrl = canvas.toDataURL(outputMime, 0.88);
            onChange(optimizedDataUrl);
          } else {
            onChange(result);
          }
        } catch {
          onChange(result);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage('Invalid image data. Please upload a valid JPG or PNG file.');
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlMode(!showUrlMode)}
          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {showUrlMode ? (
            <>
              <UploadCloud className="w-3 h-3" />
              <span>Switch to File Upload (.jpg, .png)</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" />
              <span>Or enter web URL</span>
            </>
          )}
        </button>
      </div>

      {/* Main Upload Box / Preview Area */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Image Thumbnail / Live Preview */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300/80 shrink-0 shadow-inner group ${
              aspectRatio === 'square' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-full sm:w-44 h-28'
            }`}
          >
            <Image
              src={currentPreview}
              alt={label}
              fill
              unoptimized
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
              </div>
            )}
            {value && (
              <div className="absolute top-1.5 right-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/80 text-teal-300 backdrop-blur-xs">
                  {isDataUrl ? 'Uploaded' : 'Active'}
                </span>
              </div>
            )}
          </div>

          {/* Action Area & Drop Zone */}
          <div className="flex-1 w-full space-y-2">
            {!showUrlMode ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                      : 'border-slate-300 hover:border-teal-500 bg-white hover:bg-teal-50/30'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload image <span className="text-teal-700">or drag & drop</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports <span className="font-semibold text-slate-700">JPG</span> or <span className="font-semibold text-slate-700">PNG</span> form
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">Direct Image Web Address (URL):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                  {value && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Clear image URL"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status / Controls */}
            <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
              <span className="text-[11px] text-slate-500">{helperText}</span>

              {value && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Remove / Reset Image</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
