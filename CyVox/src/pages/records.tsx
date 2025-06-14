import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioRecord {
  id: string;
  name: string;
  duration: string;
  uploadDate: string;
  size: string;
}

const mockRecords: AudioRecord[] = [
  {
    id: '1',
    name: 'Meeting Recording 1',
    duration: '15:30',
    uploadDate: '2024-01-15',
    size: '2.1 MB'
  },
  {
    id: '2',
    name: 'Voice Note',
    duration: '3:45',
    uploadDate: '2024-01-14',
    size: '512 KB'
  },
  {
    id: '3',
    name: 'Interview Audio',
    duration: '45:20',
    uploadDate: '2024-01-13',
    size: '6.8 MB'
  }
];

export function RecordsPage() {
  return (
    <div className="container py-4 md:py-8">
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Past Records</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your uploaded audio files</p>
        </div>

        <div className="grid gap-3 md:gap-4">
          {mockRecords.map((record) => (
            <Card key={record.id} className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{record.name}</h3>
                  <div className="flex flex-col md:flex-row md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <span>Duration: {record.duration}</span>
                    <span className="hidden md:inline">•</span>
                    <span>Size: {record.size}</span>
                    <span className="hidden md:inline">•</span>
                    <span>Uploaded: {record.uploadDate}</span>
                  </div>
                </div>
                
                {/* Desktop view buttons */}
                <div className="hidden md:flex gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile view dropdown */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="h-4 w-4 mr-2" /> Play
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mockRecords.length === 0 && (
          <Card className="p-8 md:p-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              No recordings found. Upload your first audio file to get started!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}