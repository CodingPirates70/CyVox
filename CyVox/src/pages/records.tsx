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
    <div className="container py-4 md:py-8 max-w-3xl mx-auto">
      <div className="space-y-4 md:space-y-6 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Past Records</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your uploaded audio files</p>
        </div>

        <div className="w-full space-y-3">
          {mockRecords.map((record) => (
            <Card key={record.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow text-center sm:text-left">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shrink-0">
                    <Play className="h-4 w-4" />
                  </Button>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{record.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.duration} • {record.size} • {record.uploadDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}