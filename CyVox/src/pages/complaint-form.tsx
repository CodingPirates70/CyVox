import { VoiceUpload } from '@/components/voice-upload'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function ComplaintFormPage() {
  const [formData, setFormData] = useState({
    userVoice: null as File | null,
    scamCall: null as File | null,
    name: '',
    address: '',
    description: ''
  })

  const handleUserVoiceUpload = (file: File) => {
    setFormData(prev => ({ ...prev, userVoice: file }))
  }

  const handleScamCallUpload = (file: File) => {
    setFormData(prev => ({ ...prev, scamCall: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
    // Handle form submission here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Register Your Complaint</h1>
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <div className="space-y-2 w-full flex flex-col items-center">
            <Label htmlFor="name" className="self-center">Full Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name" 
              required 
              className="max-w-md text-center"
            />
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <Label htmlFor="address" className="self-center">Address</Label>
            <Textarea 
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your complete address"
              className="min-h-[100px] max-w-md text-center"
              required 
            />
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <Label htmlFor="description" className="self-center">Description of Incident</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please describe the scam incident in detail"
              className="min-h-[150px] max-w-md text-center"
              required 
            />
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <Label className="self-center">Your Voice Recording (10 seconds)</Label>
            <div className="max-w-md w-full flex flex-col items-center">
              <VoiceUpload onUploadComplete={handleUserVoiceUpload} />
              {formData.userVoice && (
                <p className="text-sm text-green-600 text-center mt-2">Voice recording uploaded: {formData.userVoice.name}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <Label className="self-center">Scam Call Recording</Label>
            <div className="max-w-md w-full flex flex-col items-center">
              <VoiceUpload onUploadComplete={handleScamCallUpload} />
              {formData.scamCall && (
                <p className="text-sm text-green-600 text-center mt-2">Scam call recording uploaded: {formData.scamCall.name}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-32">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  )
}
