"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom"; 

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }) {
  // handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trailerUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-label="Trailer Modal"
    >
      <div
        className="bg-[#18181b] p-4 rounded-lg max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={trailerUrl}
            title={`${title} Trailer`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>,
    document.body
  );
}
