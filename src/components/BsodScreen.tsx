import React, { useEffect, useState } from 'react';

interface BsodScreenProps {
  onReboot: () => void;
}

export const BsodScreen: React.FC<BsodScreenProps> = ({ onReboot }) => {
  const [dumpPercent, setDumpPercent] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(6);

  useEffect(() => {
    // 6 seconds total duration with memory dump progress from 0% to 100%
    const totalDurationMs = 6000;
    const intervalTimeMs = 60;
    const stepIncrement = 100 / (totalDurationMs / intervalTimeMs);

    const timer = setInterval(() => {
      setDumpPercent((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.floor(next);
      });
    }, intervalTimeMs);

    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const rebootTimer = setTimeout(() => {
      onReboot();
    }, totalDurationMs);

    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
      clearTimeout(rebootTimer);
    };
  }, [onReboot]);

  return (
    <div
      id="bsod-screen"
      className="fixed inset-0 z-[99999] bg-[#0000aa] text-white font-mono select-none overflow-hidden cursor-none flex flex-col justify-between p-6 sm:p-12 text-xs sm:text-sm leading-relaxed"
    >
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <p className="font-bold">
          A problem has been detected and Windows has been shut down to prevent damage to your computer.
        </p>

        <p className="font-bold text-yellow-300">
          DRIVER_IRQL_NOT_LESS_OR_EQUAL
        </p>

        <p>
          If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:
        </p>

        <p>
          Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.
        </p>

        <p>
          If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode.
        </p>

        <div className="pt-2 space-y-1.5 border-t border-blue-400/40">
          <p className="font-bold">Technical information:</p>
          <p className="font-bold text-white tracking-wider">
            *** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)
          </p>
          <p>
            *** gv3.sys - Address F86B5A89 base at F86B5000, DateStamp 3dd991eb
          </p>
        </div>

        <div className="pt-3 space-y-1 text-blue-200">
          <p>Beginning dump of physical memory</p>
          <p>
            Dumping physical memory to disk: <span className="font-bold text-white">{dumpPercent}%</span>
          </p>
          {dumpPercent >= 100 && (
            <p className="text-emerald-300 font-bold">
              Physical memory dump complete.
            </p>
          )}
          <p>Contact your system administrator or technical support group for further assistance.</p>
        </div>
      </div>

      <div className="text-right text-[11px] text-blue-300 opacity-80">
        Автоматический перезапуск через: {timeLeft} сек.
      </div>
    </div>
  );
};
