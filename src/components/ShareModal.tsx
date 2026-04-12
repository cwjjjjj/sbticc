import { useState, useEffect, useCallback } from 'react';

interface ShareModalProps {
  imageBlob: Blob | null;
  fileName: string;
  shareUrl: string;
  onClose: () => void;
}

export default function ShareModal({
  imageBlob,
  fileName,
  shareUrl,
  onClose,
}: ShareModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBlob]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewUrl, fileName]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      prompt('\u590d\u5236\u4ee5\u4e0b\u94fe\u63a5\uff1a', shareUrl);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!imageBlob || !navigator.share) return;
    try {
      const file = new File([imageBlob], fileName, { type: 'image/png' });
      await navigator.share({
        title: 'SBTI \u4eba\u683c\u6d4b\u8bd5',
        text: '\u6765\u770b\u770b\u6211\u7684\u4eba\u683c\u6d4b\u8bd5\u7ed3\u679c\uff01',
        url: shareUrl,
        files: [file],
      });
    } catch {
      // User cancelled or share failed — ignore
    }
  }, [imageBlob, fileName, shareUrl]);

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl max-w-[420px] w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-semibold text-white">
            {'\u4f60\u7684\u5206\u4eab\u56fe\u5df2\u751f\u6210'}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl text-muted hover:text-white transition-colors cursor-pointer leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Share card"
              className="w-full rounded-lg"
            />
          ) : (
            <div className="text-center text-muted py-8">
              {'\u751f\u6210\u4e2d...'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 border-t border-border">
          <button
            onClick={handleDownload}
            className="bg-white text-black font-bold py-3 px-5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex-1"
          >
            {'\u4fdd\u5b58\u56fe\u7247'}
          </button>
          <button
            onClick={handleCopyLink}
            className="bg-surface-2 text-white border border-border py-3 px-5 rounded-xl hover:border-[#444] transition-colors cursor-pointer flex-1"
          >
            {copyFeedback ? '\u5df2\u590d\u5236!' : '\u590d\u5236\u94fe\u63a5'}
          </button>
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="bg-surface-2 text-white border border-border py-3 px-5 rounded-xl hover:border-[#444] transition-colors cursor-pointer flex-1"
            >
              {'\u5206\u4eab\u7ed9\u597d\u53cb'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
