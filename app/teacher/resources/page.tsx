import { requireTeacher } from "../../data/auth/require-roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  IconFileText, 
  IconUpload, 
  IconDownload, 
  IconVideo,
  IconPhoto,
  IconFile,
  IconTrash
} from "@tabler/icons-react";

export default async function TeacherResourcesPage() {
  await requireTeacher();

  // Mock resources data
  const resources = [
    {
      id: 1,
      name: "Course Introduction Video",
      type: "video",
      size: "45.2 MB",
      uploadDate: "Nov 20, 2024",
      downloads: 234
    },
    {
      id: 2,
      name: "JavaScript Fundamentals PDF",
      type: "pdf",
      size: "2.1 MB",
      uploadDate: "Nov 18, 2024",
      downloads: 156
    },
    {
      id: 3,
      name: "React Components Diagram",
      type: "image",
      size: "850 KB",
      uploadDate: "Nov 15, 2024",
      downloads: 89
    },
    {
      id: 4,
      name: "Exercise Solutions",
      type: "document",
      size: "1.5 MB",
      uploadDate: "Nov 12, 2024",
      downloads: 201
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <IconVideo className="h-4 w-4" />;
      case "image":
        return <IconPhoto className="h-4 w-4" />;
      case "pdf":
        return <IconFileText className="h-4 w-4" />;
      default:
        return <IconFile className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Manage your course materials and resources
          </p>
        </div>
        <Button>
          <IconUpload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Resource Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">
              Resources uploaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <IconDownload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.reduce((acc, r) => acc + r.downloads, 0)}</div>
            <p className="text-xs text-muted-foreground">
              All time downloads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <IconFile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">49.6</div>
            <p className="text-xs text-muted-foreground">
              MB of 1 GB used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <IconVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              Course intro video
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Resources</CardTitle>
          <CardDescription>
            Manage and organize your course materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getFileIcon(resource.type)}
                  </div>
                  <div>
                    <p className="font-medium">{resource.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {resource.size} • Uploaded {resource.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{resource.downloads}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <IconDownload className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <IconUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload new resources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support for videos, documents, images, and more
            </p>
            <Button>
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}