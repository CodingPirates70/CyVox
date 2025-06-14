import { useState, useRef, useCallback } from 'react';
import { Upload, Mic, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VoiceUploadProps {
  onUploadComplete?: (file: File) => void;
}

export function VoiceUpload({ onUploadComplete }: VoiceUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      handleFileUpload(audioFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onUploadComplete?.(file);
          toast({
            title: "Upload successful!",
            description: `${file.name} has been uploaded successfully.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudio(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording error",
        description: "Could not start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearRecording = () => {
    setRecordedAudio(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsPlaying(false);
  };

  const uploadRecording = () => {
    if (recordedAudio) {
      const file = new File([recordedAudio], 'recording.wav', { type: 'audio/wav' });
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card
        className={`upload-area p-8 border-2 border-dashed transition-all duration-300 ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Voice Recording</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your audio file here, or click to browse
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
            
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
              className={`gap-2 ${isRecording ? 'animate-pulse-glow' : ''}`}
              disabled={isUploading}
            >
              <Mic className="h-4 w-4" />
              {isRecording ? 'Stop Recording' : 'Record Audio'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>
      </Card>

      {recordedAudio && (
        <Card className="p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={playAudio}
                className="h-10 w-10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div>
                <p className="font-medium">Recorded Audio</p>
                <p className="text-sm text-muted-foreground">Ready to upload</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={uploadRecording} size="sm">
                Upload Recording
              </Button>
              <Button variant="outline" size="sm" onClick={clearRecording}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </Card>
      )}

      {isUploading && (
        <Card className="p-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        </Card>
      )}
    </div>
  );
}