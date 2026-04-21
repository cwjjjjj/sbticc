import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackEvent } from '../hooks/useAnalytics';

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

  // Can the browser share a file via the native share sheet?
  // iOS Safari / Chrome Android 89+ / most modern mobile browsers support this.
  // Desktop browsers usually don't support files in share (even if navigator.share exists).
  const canShareFiles = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    if (!navigator.share || !navigator.canShare) return false;
    if (!imageBlob) return false;
    try {
      const probeFile = new File([imageBlob], fileName, { type: imageBlob.type || 'image/png' });
      return navigator.canShare({ files: [probeFile] });
    } catch {
      return false;
    }
  }, [imageBlob, fileName]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackEvent('share_click', { platform: 'download' });
  }, [previewUrl, fileName]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
      trackEvent('share_click', { platform: 'copy_link' });
    } catch {
      prompt('\u590d\u5236\u4ee5\u4e0b\u94fe\u63a5\uff1a', shareUrl);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!imageBlob) return;
    try {
      const file = new File([imageBlob], fileName, { type: imageBlob.type || 'image/png' });
      await navigator.share({
        title: '\u6211\u7684\u4eba\u683c\u6d4b\u8bd5\u7ed3\u679c',
        text: '\u6765\u770b\u770b\u6211\u7684\u4eba\u683c\u6d4b\u8bd5\u7ed3\u679c',
        url: shareUrl,
        files: [file],
      });
      trackEvent('share_click', { platform: 'native' });
      onClose();
    } catch (err) {
      // AbortError = user cancelled — do nothing.
      if (err instanceof Error && err.name === 'AbortError') return;
      // Any other error: fall back to download so user still gets the image.
      handleDownload();
    }
  }, [imageBlob, fileName, shareUrl, onClose, handleDownload]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl max-w-[420px] w-full mx-4 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-border">
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

        {/* Body — scrollable area with image capped to viewport height */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex items-start justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Share card"
              className="max-w-full w-auto rounded-lg object-contain"
              style={{ maxHeight: '55vh' }}
            />
          ) : (
            <div className="text-center text-muted py-8">
              {'\u751f\u6210\u4e2d...'}
            </div>
          )}
        </div>

        {/* Actions — on mobile with file-share support, native share becomes the primary CTA */}
        <div className="flex-shrink-0 p-5 border-t border-border space-y-3">
          {canShareFiles && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{'\u2197'}</span>
              <span>{'\u5206\u4eab\u5230\u5fae\u4fe1 / \u5176\u4ed6\u5e94\u7528'}</span>
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className={`py-3 px-5 rounded-xl transition-colors cursor-pointer flex-1
                ${canShareFiles
                  ? 'bg-surface-2 text-white border border-border hover:border-[#444]'
                  : 'bg-white text-black font-bold hover:bg-gray-100'}`}
            >
              {'\u4fdd\u5b58\u56fe\u7247'}
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-surface-2 text-white border border-border py-3 px-5 rounded-xl hover:border-[#444] transition-colors cursor-pointer flex-1"
            >
              {copyFeedback ? '\u5df2\u590d\u5236!' : '\u590d\u5236\u94fe\u63a5'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
