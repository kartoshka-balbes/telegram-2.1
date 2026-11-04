import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Camera, RefreshCw, SwitchCamera, Download, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const CameraTool: React.FC<ToolProps> = ({ onClose }) => {
  const [capturing, setCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setHasCamera(true);
            setCameraError(null);
          }
        } else {
          setCameraError('Камера не поддерживается вашим браузером');
        }
      } catch (err) {
        setCameraError('Разрешите доступ к камере или используйте режим эмуляции');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleTakePhoto = () => {
    soundManager.playCameraClick();
    setCapturing(true);

    setTimeout(() => {
      soundManager.playRock();
      if (videoRef.current && canvasRef.current && hasCamera) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.95));
        }
      } else {
        // Fallback procedural polaroid snapshot
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 640, 480);
          grad.addColorStop(0, '#091e14');
          grad.addColorStop(1, '#020b06');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 640, 480);
          ctx.fillStyle = '#8f9bff';
          ctx.font = 'bold 36px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('📷 4K ULTRA HD SNAPSHOT', 320, 240);
          ctx.font = '18px monospace';
          ctx.fillStyle = '#888';
          ctx.fillText(new Date().toLocaleString('ru-RU'), 320, 280);
          setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.95));
        }
      }
      setCapturing(false);
    }, 400);
  };

  const handleToggleFacingMode = () => {
    soundManager.playBeep(900, 0.05);
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <ToolWrapper title="Камера 4K Ultra HD" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-2 font-mono text-xs">
        
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Viewfinder Screen */}
        <div className="bg-slate-950 border-2 border-slate-800 aspect-square rounded-3xl relative flex flex-col items-center justify-center p-2 overflow-hidden shadow-2xl">
          {/* Viewfinder Grid overlay */}
          <div className="absolute inset-0 pointer-events-none border border-slate-800/40 grid grid-cols-3 grid-rows-3 z-20" />

          {/* Real live camera video feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover rounded-2xl ${
              capturedPhoto ? 'hidden' : 'block'
            } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />

          {/* Flash / Capture animation */}
          {capturing && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
          )}

          {/* If Captured Photo exists, show photo preview */}
          {capturedPhoto && !capturing && (
            <div className="w-full h-full relative z-30 flex flex-col items-center justify-center">
              <img
                src={capturedPhoto}
                alt="Снимок камеры"
                className="w-full h-full object-cover rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
              />
              <div className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-bold border border-emerald-500/40 flex items-center gap-1">
                <Check className="w-3 h-3" /> Снимок сохранён
              </div>
            </div>
          )}

          {/* Fallback if camera stream is blocked */}
          {!hasCamera && !capturedPhoto && (
            <div className="text-center text-slate-500 z-10 p-4 space-y-2">
              <Camera className="w-14 h-14 mx-auto opacity-40 text-cyan-400" />
              <span className="font-bold block text-xs text-slate-300">ОБЪЕКТИВ ГОТОВ К СНИМКУ</span>
              <p className="text-[10px] text-slate-500">{cameraError || 'Нажмите кнопку затвора для захвата кадра'}</p>
            </div>
          )}
        </div>

        {/* Controls Toolbar */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-around mt-3 shadow-xl">
          <button
            onClick={handleToggleFacingMode}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
            title="Переключить камеру"
          >
            <SwitchCamera className="w-5 h-5 text-cyan-400" />
          </button>

          {/* Shutter Button */}
          <button
            onClick={handleTakePhoto}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 border-4 border-slate-900 ring-4 ring-red-500/50 flex items-center justify-center text-white shadow-2xl cursor-pointer active:scale-90 transition-all"
            title="Сделать снимок"
          >
            <Camera className="w-7 h-7" />
          </button>

          {capturedPhoto ? (
            <button
              onClick={() => setCapturedPhoto(null)}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
              title="Новый снимок"
            >
              <RefreshCw className="w-5 h-5 text-amber-400" />
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

      </div>
    </ToolWrapper>
  );
};
