"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FaLightbulb } from "react-icons/fa";
import { X } from "lucide-react";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackPopup({ isOpen, onClose }: FeedbackPopupProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("SUGGESTION");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    general?: string;
  }>({});

  const createFeedback = api.feedback.create.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        setTitle("");
        setContent("");
        setType("SUGGESTION");
        setSuccess(false);
        onClose();
      }, 2000);
    },
    onError: (error) => {
      setSubmitting(false);
      setErrors({
        ...errors,
        general: `Gönderilirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      content?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Başlık zorunludur";
    } else if (title.trim().length < 3) {
      newErrors.title = "Başlık en az 3 karakter olmalıdır";
    }

    if (!content.trim()) {
      newErrors.content = "İçerik zorunludur";
    } else if (content.trim().length < 10) {
      newErrors.content = "İçerik en az 10 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      createFeedback.mutate({
        title,
        content,
        type,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <FaLightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Öneri ve Geri Bildirim
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {success ? (
          <div className="my-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Geri bildiriminiz başarıyla gönderildi!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Geri Bildirim Türü
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
              >
                <option value="SUGGESTION">Öneri</option>
                <option value="FEATURE">Özellik İsteği</option>
                <option value="BUG">Hata Bildirimi</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Başlık
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors({ ...errors, title: undefined });
                  }
                }}
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                placeholder="Önerinizin başlığı"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                İçerik
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) {
                    setErrors({ ...errors, content: undefined });
                  }
                }}
                rows={4}
                className={`mt-1 block w-full rounded-md border ${
                  errors.content ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                placeholder="Önerinizi detaylı bir şekilde açıklayın (en az 10 karakter)"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-600">{errors.content}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                onClick={onClose}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-75"
              >
                {submitting ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
