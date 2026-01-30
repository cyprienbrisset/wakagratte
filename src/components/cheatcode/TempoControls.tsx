'use client';

interface TempoControlsProps {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  isPlaying: boolean;
  onToggle: () => void;
  currentBeat: number;
  disabled?: boolean;
}

const TEMPO_PRESETS = [60, 80, 100, 120];

export function TempoControls({
  tempo,
  onTempoChange,
  isPlaying,
  onToggle,
  currentBeat,
  disabled,
}: TempoControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Toggle play/pause */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${
          isPlaying
            ? 'bg-amber-500 text-gray-900'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isPlaying ? 'Arrêter le métronome' : 'Démarrer le métronome'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Beat indicator */}
      {isPlaying && (
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((beat) => (
            <div
              key={beat}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBeat === beat
                  ? 'bg-amber-500 scale-125'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Tempo slider */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={40}
          max={200}
          value={tempo}
          onChange={(e) => onTempoChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-24 accent-amber-500"
        />
        <span className="text-sm text-white font-mono w-16">{tempo} BPM</span>
      </div>

      {/* Presets */}
      <div className="flex gap-1">
        {TEMPO_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onTempoChange(preset)}
            disabled={disabled}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              tempo === preset
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
