import React, { useEffect, useRef, useState } from "react";
import ImagePicker from "./ImagePicker";
import FilePicker from "./FilePicker";
import RemoveButton from "./RemoveButton";
import EmojiRow from "./EmojiRow";
import detectMobile from "../../utils/detectMobile";
import { Mic, MicOff, Smile, Send } from "lucide-react";

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;
type NewMessageFormProps = {
  handleSubmit: any;
  text: string;
  setText: SetStateType<string>;
  selectedImg?: string;
  setSelectedImg?: SetStateType<string>;
  previewImg?: boolean;
  setPreviewImg?: SetStateType<boolean>;
  resetImage: () => void;
  voiceClip?: string;
  setVoiceClip?: SetStateType<string>;
  clearVoiceClip?: () => void;
  voiceUploading?: boolean;
  setVoiceUploading?: SetStateType<boolean>;
  selectedFile?: any;
  setSelectedFile?: SetStateType<any>;
  fileUploading?: boolean;
  setFileUploading?: SetStateType<boolean>;
  onFileChoose?: (file: File) => Promise<void>;
};

const audioUploadURL = "/api/audio/upload";

export const NewMessageForm = ({
  handleSubmit,
  text,
  setText,
  selectedImg,
  setSelectedImg,
  previewImg,
  setPreviewImg,
  resetImage,
  voiceClip,
  setVoiceClip,
  clearVoiceClip,
  voiceUploading,
  setVoiceUploading,
  selectedFile,
  setSelectedFile,
  fileUploading,
  setFileUploading,
  onFileChoose,
}: NewMessageFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [emojiVisibility, setEmojiVisibility] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number>();

  const stopTimer = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = undefined;
    }
  };

  const startTimer = () => {
    stopTimer();
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopActiveStream = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadVoiceClip = async (blob: Blob): Promise<string> => {
    const fallbackToInline = async () => blobToBase64(blob);
    try {
      const formData = new FormData();
      formData.append("audio", blob, `voice-${Date.now()}.webm`);
      const response = await fetch(audioUploadURL, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.audioUrl) {
        return fallbackToInline();
      }
      return payload.audioUrl as string;
    } catch (err) {
      console.error(err);
      return fallbackToInline();
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      return;
    }
    if (voiceUploading) {
      setRecordingError("Upload en cours. Patientez avant un nouvel enregistrement.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingError("Votre navigateur ne supporte pas l'enregistrement audio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        stopTimer();
        const blob = new Blob(recordingChunksRef.current, { type: "audio/webm" });
        recordingChunksRef.current = [];
        setIsRecording(false);
        stopActiveStream();
        if (blob.size === 0) {
          setRecordingError("Aucun audio capturé, veuillez réessayer.");
          return;
        }
        setRecordingError(null);
        setVoiceUploading?.(true);
        try {
          const uploadedUrl = await uploadVoiceClip(blob);
          setVoiceClip?.(uploadedUrl);
        } catch (error) {
          console.error(error);
          setRecordingError("Impossible de traiter le message vocal.");
        } finally {
          setVoiceUploading?.(false);
        }
      };
      recorder.start();
      setVoiceClip?.("");
      setRecordingDuration(0);
      startTimer();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setRecordingError("Accès au micro refusé.");
    }
  };

  const stopRecording = () => {
    if (!isRecording) {
      return;
    }
    mediaRecorderRef.current?.stop();
    stopTimer();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    return () => {
      stopTimer();
      stopActiveStream();
    };
  }, []);

  return (
    <form className="space-y-3 px-3 md:px-0" onSubmit={handleSubmit}>
      {emojiVisibility && !detectMobile() && (
        <div className="rounded-xl border border-holo-border/70 bg-holo-panel/80 p-2 shadow-holo-soft mb-2 backdrop-blur">
          <EmojiRow text={text} setText={setText} />
        </div>
      )}
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        <div className="flex-1 flex items-center gap-2 sm:gap-3 rounded-full border border-holo-border/70 bg-black/50 px-3 sm:px-4 py-2.5 shadow-[0_16px_42px_rgba(0,0,0,0.55)] backdrop-blur focus-within:border-holo-cyan/70 focus-within:shadow-[0_0_0_1px_rgba(0,201,213,0.55)] transition-all min-h-[44px]">
          <button
            onClick={() => setEmojiVisibility((prev) => !prev)}
            type="button"
            className="text-holo-text-secondary hover:text-holo-cyan transition-colors"
            aria-label="Choisir un emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Image picker (legacy) */}
          <ImagePicker
            selectedImg={selectedImg}
            setSelectedImg={setSelectedImg}
            setText={setText}
            previewImg={previewImg}
            setPreviewImg={setPreviewImg}
          />

          {/* Generic file picker (supports any type) */}
          <FilePicker
            onFileChoose={async (file) => {
              setFileUploading?.(true);
              try {
                if (onFileChoose) {
                  await onFileChoose(file);
                }
              } catch (err) {
                console.error('File upload failed', err);
                alert('Erreur lors de l\'upload du fichier');
              } finally {
                setFileUploading?.(false);
              }
            }}
          />

          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none text-[15px] text-holo-text-primary placeholder-holo-text-secondary/50 focus:outline-none focus:ring-0"
            type="text"
            name="input_text"
            placeholder="Write a message... (encrypted)"
            onChange={(e) => setText(e.target.value)}
            value={text}
            autoComplete="off"
          />
        </div>

        <button
          type="button"
          className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
            isRecording
              ? "bg-red-500 text-white animate-pulse shadow-[0_12px_32px_rgba(248,113,113,0.35)]"
              : "bg-black/45 border border-holo-border/70 text-holo-text-secondary hover:text-holo-cyan hover:border-holo-cyan/70 shadow-[0_14px_32px_rgba(0,0,0,0.45)]"
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          type="submit"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-holo-cyan text-[#04262d] shadow-[0_14px_44px_rgba(0,201,213,0.28)] hover:shadow-[0_18px_55px_rgba(0,201,213,0.35)] hover:scale-[1.03] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={!text && !selectedImg && !voiceClip}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-holo-text-secondary px-1 md:px-4">
        {selectedImg && <RemoveButton onClick={resetImage} />}
        {selectedFile && (
          <div className="flex items-center gap-2 px-2 py-1 bg-holo-panel/80 rounded-full border border-holo-border">
            <div className="text-sm">{selectedFile.originalName || selectedFile.filename}</div>
            <button onClick={() => setSelectedFile?.(null)} className="text-xs underline">Remove</button>
          </div>
        )}
        {isRecording && <span>Recording {formatDuration(recordingDuration)}</span>}
        {voiceUploading && <span>Uploading voice message...</span>}
      </div>

      {voiceClip && (
        <div className="rounded-2xl border border-holo-border/80 bg-holo-panel/80 p-3 text-holo-text-primary shadow-holo-soft mx-1 md:mx-2">
          <div className="mb-2 flex items-center justify-between text-sm text-holo-text-secondary">
            <span>Voice message ready</span>
            <RemoveButton onClick={clearVoiceClip ?? (() => setVoiceClip?.(""))} />
          </div>
          <audio controls preload="none" src={voiceClip} className="w-full" />
        </div>
      )}
      {recordingError && <div className="text-sm text-rose-600 px-4">{recordingError}</div>}
    </form>
  );
};
