import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import { AudioPlayer } from '@/components/ui/audio-player';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Complaint {
  id: string;
  name: string;
  subject: string;
  description: string;
  city: string;
  state: string;
  submittedAt: string;
  userVoice: string | null;  // base64 string
  scamCall: string | null;   // base64 string
}

export function RecordsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Load complaints from localStorage
    const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(storedComplaints);
  }, []);

  const handleDelete = (id: string) => {
    // Filter out the complaint with the given id
    const updatedComplaints = complaints.filter(complaint => complaint.id !== id);
    
    // Update localStorage
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    // Update state
    setComplaints(updatedComplaints);
  };

  return (
    <div className="container py-4 md:py-8 max-w-3xl mx-auto">
      <div className="space-y-4 md:space-y-6 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Past Records</h1>
          <p className="text-sm md:text-base text-muted-foreground">View your submitted complaints</p>
        </div>        <div className="w-full space-y-3">
          {complaints.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No complaints submitted yet.</p>
            </Card>
          ) : (
            complaints.map((complaint) => (
              <Card key={complaint.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{complaint.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by: {complaint.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Location: {complaint.city}, {complaint.state}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(complaint.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(complaint.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">{complaint.description}</p>
                  </div>                  {(complaint.userVoice || complaint.scamCall) && (
                    <div className="border-t pt-3 mt-2 space-y-4">
                      {complaint.userVoice && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">User Voice Recording:</p>
                          <AudioPlayer src={complaint.userVoice} />
                        </div>
                      )}
                      {complaint.scamCall && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Scam Call Recording:</p>
                          <AudioPlayer src={complaint.scamCall} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}