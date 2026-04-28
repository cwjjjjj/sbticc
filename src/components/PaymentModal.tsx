interface PaymentModalProps {
  open: boolean;
  testName: string;
  amount: 199 | 299;
  paymentReference: string;
  onAmountChange: (amount: 199 | 299) => void;
  onConfirmPaid: () => void;
  onClose: () => void;
}

const amountOptions: Array<{ value: 199 | 299; label: string; desc: string }> = [
  { value: 199, label: '¥1.99', desc: '解锁本次完整报告' },
  { value: 299, label: '¥2.99', desc: '顺手支持作者继续整活' },
];

export default function PaymentModal({
  open,
  testName,
  amount,
  paymentReference,
  onAmountChange,
  onConfirmPaid,
  onClose,
}: PaymentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[420] flex items-center justify-center bg-black/75 px-4">
      <div className="w-full max-w-[360px] rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-accent">REPORT UNLOCK</p>
            <h3 className="mt-1 text-lg font-bold text-white">解锁完整报告</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-surface-2 text-muted hover:text-white"
            aria-label="关闭"
          >
            x
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {amountOptions.map((option) => {
            const selected = amount === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onAmountChange(option.value)}
                className={[
                  'rounded-xl border px-3 py-3 text-left transition-colors',
                  selected
                    ? 'border-accent bg-accent/15 text-white'
                    : 'border-border bg-surface-2 text-muted hover:border-[#444] hover:text-white',
                ].join(' ')}
              >
                <span className="block text-base font-bold">{option.label}</span>
                <span className="mt-1 block text-[11px] leading-snug">{option.desc}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-bg p-4 text-center">
          <img
            src="/images/wechat-qr.png"
            alt="扫码支付或赞赏"
            className="mx-auto h-[190px] w-[190px] rounded-xl bg-white object-cover"
          />
          <p className="mt-3 text-xs text-muted leading-relaxed">
            扫码支付 {amount === 199 ? '¥1.99' : '¥2.99'}，备注：
          </p>
          <p className="mt-1 select-all break-all font-mono text-xs font-bold text-white">
            {paymentReference}
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-surface-2 px-3 py-3 text-xs text-muted leading-relaxed">
          解锁后可查看 {testName} 的维度深度解析，并生成无水印高清分享图。当前为小额赞赏信任模式，支付后点击下方按钮即可解锁。
        </div>

        <button
          type="button"
          onClick={onConfirmPaid}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent/90"
        >
          我已支付，解锁报告
        </button>
      </div>
    </div>
  );
}
