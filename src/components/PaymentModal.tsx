import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function PaymentModal({ onClose, onConfirm }: PaymentModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 bg-surface border border-border rounded-3xl p-8 max-w-[360px] w-full text-center shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-white text-2xl transition-colors cursor-pointer"
          >
            &times;
          </button>
          
          <h3 className="text-xl font-bold text-white mb-6">扫码支付 ¥1.99</h3>
          
          <p className="text-sm text-muted mb-6">
            请用微信扫码支付（面包多 / 爱发电）<br/>
            支付后点击下方按钮解锁
          </p>
          
          <div className="aspect-square w-48 mx-auto bg-white p-2 rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
            {/* 
              Placeholder for real QR code. 
              In production, this would be a real image URL.
            */}
            <div className="text-[#999] text-xs leading-relaxed px-4 text-center">
              支付二维码<br/>
              (请在后台配置)
            </div>
          </div>
          
          <button
            onClick={onConfirm}
            className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:bg-accent/90 transition-colors cursor-pointer"
          >
            我已支付，解锁报告
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
