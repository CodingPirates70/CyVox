import { VoiceUpload } from '@/components/voice-upload';
import { HeroSection } from '@/components/hero-section';

export function HomePage() {
  const handleUploadComplete = (file: File) => {
    console.log('Upload complete:', file.name);
    // Here you would typically send the file to your backend
  };

  return (
    <div className="container py-12 space-y-16">
      <HeroSection />
      <VoiceUpload onUploadComplete={handleUploadComplete} />
    </div>
  );
}