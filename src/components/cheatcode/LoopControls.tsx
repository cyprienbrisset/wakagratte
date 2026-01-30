'use client';

interface LoopControlsProps {
  sequenceLength: number;
  loopStart: number | null;
  loopEnd: number | null;
  onLoopChange: (start: number | null, end: number | null) => void;
  loopCount: number;
  disabled?: boolean;
}

export function LoopControls({
  sequenceLength,
  loopStart,
  loopEnd,
  onLoopChange,
  loopCount,
  disabled
}: LoopControlsProps) {
  const isLoopActive = loopStart !== null && loopEnd !== null;

  const toggleLoop = () => {
    if (isLoopActive) {
      onLoopChange(null, null);
    } else {
      // Par defaut: loop sur toute la sequence
      onLoopChange(0, sequenceLength - 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleLoop}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${
          isLoopActive
            ? 'bg-amber-500 text-gray-900'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isLoopActive ? 'Desactiver le loop' : 'Activer le loop'}
      >
        {/* Icone repeat SVG */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {isLoopActive && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-400">De</label>
            <input
              type="number"
              min={1}
              max={loopEnd !== null ? loopEnd + 1 : sequenceLength}
              value={(loopStart ?? 0) + 1}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) return;
                onLoopChange(Math.max(0, value - 1), loopEnd);
              }}
              className="w-14 px-2 py-1 bg-gray-700 rounded text-white text-center"
              disabled={disabled}
            />
            <label className="text-gray-400">a</label>
            <input
              type="number"
              min={(loopStart ?? 0) + 1}
              max={sequenceLength}
              value={(loopEnd ?? sequenceLength - 1) + 1}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) return;
                onLoopChange(loopStart, Math.min(sequenceLength - 1, value - 1));
              }}
              className="w-14 px-2 py-1 bg-gray-700 rounded text-white text-center"
              disabled={disabled}
            />
          </div>

          {loopCount > 0 && (
            <span className="text-amber-400 text-sm font-medium">
              {loopCount}x
            </span>
          )}
        </>
      )}
    </div>
  );
}
