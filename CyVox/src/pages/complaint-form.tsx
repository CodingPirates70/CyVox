import { VoiceUpload } from '@/components/voice-upload'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPincodeDetails } from '@/lib/pincode'
import { useToast } from '@/hooks/use-toast'

export function ComplaintFormPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false) 
  const [formData, setFormData] = useState({
    userVoice: null as File | null,
    scamCall: null as File | null,
    name: '',
    pincode: '',
    city: '',
    state: '',
    district:'',
    street: '',
    subject: '',
    description: '',
    date: undefined as Date | undefined
  })

  const handleUserVoiceUpload = (file: File) => {
    setFormData(prev => ({ ...prev, userVoice: file }))
  }

  const handleScamCallUpload = (file: File) => {
    setFormData(prev => ({ ...prev, scamCall: file }))
  }

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    setFormData(prev => ({ ...prev, pincode }));

    // Only fetch if pincode is 6 digits
    if (pincode.length === 6) {
      setIsLoading(true);
      try {
        const details = await getPincodeDetails(pincode);
        if (details) {
          setFormData(prev => ({
            ...prev,
            city: details.city,
            district:details.district,
            state: details.state,
            
          }));
        } else {
          toast({
            title: "Invalid Pincode",
            description: "Could not find location details for this pincode",
            variant: "destructive",
          });
          setFormData(prev => ({
            ...prev,
            city: '',
            district: '',
            state: ''
          }));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch location details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Clear city and state if pincode is incomplete
      setFormData(prev => ({
        ...prev,
        city: '',
        district: '',
        state: ''
      }));
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value || '' }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.pincode || !formData.subject || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert files to base64
      const userVoiceBase64 = formData.userVoice ? await convertFileToBase64(formData.userVoice) : null;
      const scamCallBase64 = formData.scamCall ? await convertFileToBase64(formData.scamCall) : null;

      // Create complaint object with current timestamp as ID and base64 audio
      const complaint = {
        id: Date.now().toString(),
        ...formData,
        userVoice: userVoiceBase64,
        scamCall: scamCallBase64,
        submittedAt: new Date().toISOString(),
      };

     
      const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      
      
      localStorage.setItem('complaints', JSON.stringify([...existingComplaints, complaint]));     
      toast({
        title: "Success",
        description: "Your complaint has been submitted successfully. Redirecting to records...",
      });

      // Navigate to records page after a short delay to allow the toast to be seen
      setTimeout(() => {
        navigate('/records');
      }, 100);

      // Reset form
      setFormData({
        userVoice: null,
        scamCall: null,
        name: '',
        pincode: '',
        city: '',
        state: '',
        district: '',
        street: '',
        subject: '',
        description: '',
        date: undefined
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process audio files. Please try again.",
        variant: "destructive",
      });
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Register Your Complaint</h1>        <form onSubmit={handleSubmit} className="space-y-0 flex flex-col items-center ">
          <div className="space-y-2 w-full flex flex-col items-center py-6">
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
          </div>          <div className="space-y-4 w-full flex flex-col items-center py-6">
            <Label className="self-center">Address Details</Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md w-full">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input 
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="Enter pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required 
                  className={`text-center ${isLoading ? 'opacity-50' : ''}`}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={isLoading ? "Loading..." : "City"}
                  required 
                  className="text-center"
                  // readOnly={isLoading || !!formData.city}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="District">District</Label>
                <Input 
                  id="District"
                  name="District"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder={isLoading ? "Loading..." : "district"}
                  required 
                  className="text-center"
                  // readOnly={isLoading || !!formData.city}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  name="state"
                  value={formData.state }
                  onChange={handleInputChange}
                  placeholder={isLoading ? "Loading..." : "State"}
                  required 
                  className="text-center"
                  // readOnly={isLoading || !!formData.state}
                />
              </div>
            </div>

            <div className="space-y-2 w-full max-w-md">
              <Label htmlFor="street">Street Address</Label>
              <Textarea 
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className="min-h-[80px] text-center"
                required 
              />
            </div>
          </div>          <div className="space-y-2 w-full flex flex-col items-center py-6">
            <Label htmlFor="subject" className="self-center">Subject of Complaint</Label>
            <Input 
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter the subject of your complaint"
              className="max-w-md text-center"
              required 
            />
          </div>          
          <div className="space-y-2 w-full flex flex-col items-center py-6">
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
          </div>          <div className="space-y-2 w-full flex flex-col items-center py-6">
            <Label htmlFor="date" className="self-center">Date of Incident</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-md justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}                 
                  onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>          <div className="space-y-2 w-full flex flex-col items-center py-6">
            <Label className="self-center">Your Voice Recording (10 seconds)</Label>
            <div className="max-w-md w-full flex flex-col items-center">
              <VoiceUpload onUploadComplete={handleUserVoiceUpload} />
              {formData.userVoice && (
                <p className="text-sm text-green-600 text-center mt-2">Voice recording uploaded: {formData.userVoice.name}</p>
              )}
            </div>
          </div>          <div className="space-y-2 w-full flex flex-col items-center py-6">
            <Label className="self-center">Scam Call Recording</Label>
            <div className="max-w-md w-full flex flex-col items-center">
              <VoiceUpload onUploadComplete={handleScamCallUpload} />
              {formData.scamCall && (
                <p className="text-sm text-green-600 text-center mt-2">Scam call recording uploaded: {formData.scamCall.name}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-32" disabled={isLoading}>
            Submit
          
          </Button>
        </form>
      </Card>
    </div>
  )
}
