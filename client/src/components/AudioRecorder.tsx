import React, { useState, useRef } from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface AudioRecorderProps {
  onAudioSend: (audioUrl: string, audioSize: number) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioSend, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      alert('Erreur d\'accès au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        onAudioSend(data.audioUrl, data.audioSize);
      } else {
        alert('Erreur lors de l\'upload du fichier audio');
      }
    } catch (error) {
      console.error('Erreur d\'upload:', error);
      alert('Erreur lors de l\'upload du fichier audio');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="d-flex gap-2">
      {!isRecording ? (
        <Button
          variant="outline-success"
          size="sm"
          onClick={startRecording}
          disabled={disabled || isUploading}
          title="Commencer l'enregistrement"
        >
          🎤 Enregistrer
        </Button>
      ) : (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={stopRecording}
          title="Arrêter l'enregistrement"
        >
          ⏹️ Arrêter
        </Button>
      )}
      {isUploading && <Spinner animation="border" size="sm" />}
    </div>
  );
};

export default AudioRecorder;
