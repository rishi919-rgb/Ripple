import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();

  const handleAnalyzeDemo = () => {
    navigate("/detection");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold tracking-tight">Ripple</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Snap or choose a food photo
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 mt-4">
          <Button onClick={handleAnalyzeDemo} size="lg" className="gap-2 cursor-pointer">
            <Camera className="w-5 h-5" />
            Analyze Pizza (Demo)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
