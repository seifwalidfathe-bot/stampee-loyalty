import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface SecretPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctPin: string;
  onSuccess: (stampsToAdd: number) => void;
}

export const SecretPinModal: React.FC<SecretPinModalProps> = ({
  isOpen,
  onClose,
  correctPin,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [stampsCount, setStampsCount] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (isOpen === false) return null;

  const handleDigit = (digit: string) => {
    soundEngine.playKeypadTick();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess(stampsCount);
            setPin('');
            setSuccess(false);
            onClose();
          }, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    soundEngine.playKeypadTick();
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-[#14171A] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold tracking-tight">Staff Stamping PIN</h3>
          <p className="text-xs text-zinc-400 mt-1">Enter cashier PIN to issue stamps</p>
        </div>

        {/* Stamps Selector */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-xs text-zinc-400">Stamps:</span>
          {[1, 2, 3].map(count => (
            <button
              key={count}
              type="button"
              onClick={() => {
                soundEngine.playKeypadTick();
                setStampsCount(count);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                stampsCount === count
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              +{count}
            </button>
          ))}
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(index => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-red-500 scale-110 animate-shake'
                    : success
                    ? 'bg-emerald-500 scale-125'
                    : isFilled
                    ? 'bg-rose-500 scale-110 shadow-sm shadow-rose-500/50'
                    : 'bg-zinc-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs mb-4 animate-shake">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Incorrect PIN, try again</span>
          </div>
        )}

        {success && (
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PIN verified. Stamping...</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/5 text-lg font-mono font-medium text-white transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/5 text-lg font-mono font-medium text-white transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/5 text-xs font-mono font-medium text-zinc-400 hover:text-white transition-all flex items-center justify-center"
          >
            Del
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-zinc-500">Demo Cashier PIN is <span className="font-mono text-zinc-300 font-bold">{correctPin}</span></p>
        </div>
      </div>
    </div>
  );
};
