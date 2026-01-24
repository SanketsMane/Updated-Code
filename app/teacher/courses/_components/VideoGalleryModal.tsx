"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Film, Loader2 } from "lucide-react";
import { getTeacherMedia } from "@/app/actions/media";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Video {
    id: string;
    title: string;
    videoKey: string;
    createdAt: Date;
    courseName: string;
}

interface VideoGalleryModalProps {
    onSelect: (videoKey: string) => void;
}

export function VideoGalleryModal({ onSelect }: VideoGalleryModalProps) {
    const [open, setOpen] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const data = await getTeacherMedia();
            setVideos(data);
        } catch (error) {
            toast.error("Failed to load video library");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && videos.length === 0) {
            fetchVideos();
        }
    }, [open]);

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.courseName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (key: string) => {
        onSelect(key);
        setOpen(false);
        toast.success("Video selected from gallery");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Film className="h-4 w-4" />
                    Select from Gallery
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Video Gallery</DialogTitle>
                    <DialogDescription>
                        Select a video from your previously uploaded lessons.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by lesson name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ScrollArea className="flex-1 min-h-[300px] border rounded-md p-4">
                        {filteredVideos.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No videos found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        className={cn(
                                            "border rounded-lg p-3 cursor-pointer hover:bg-muted transition-all flex flex-col gap-2 relative group"
                                        )}
                                        onClick={() => handleSelect(video.videoKey)}
                                    >
                                        <div className="bg-slate-100 aspect-video rounded flex items-center justify-center text-slate-400">
                                            <Film className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <p className="font-medium truncate" title={video.title}>{video.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{video.courseName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(video.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <Button size="sm">Select</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
}
