
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Instagram, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  username: string;
}

const SocialShare = ({ username }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const profileUrl = `${window.location.origin}/${username}`;
  const bioText = `Send me anonymous messages 👀 ${profileUrl}`;
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Ready to paste in your bio",
      });
    } catch (error) {
      toast({
        title: "Could not copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AnonChat - Send me anonymous messages',
          text: bioText,
          url: profileUrl,
        });
      } else {
        copyToClipboard(bioText);
      }
    } catch (error) {
      console.log('Share failed, copying instead');
      copyToClipboard(bioText);
    }
  };

  const shareToInstagram = () => {
    copyToClipboard(bioText);
    toast({
      title: "Text copied! 📋",
      description: "Now paste it in your Instagram bio",
    });
    // Note: We can't directly open Instagram to bio editing, so we just copy the text
  };

  return (
    <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5 text-pink-600" />
          Share Your Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-sm text-gray-600 mb-2">Your anonymous message link:</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 truncate">
              {profileUrl}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(profileUrl)}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-sm text-gray-600 mb-2">Perfect for your bio:</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
              {bioText}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(bioText)}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={shareProfile}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button
            onClick={shareToInstagram}
            variant="outline"
            className="flex-1"
          >
            <Instagram className="w-4 h-4 mr-2" />
            For Instagram
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            📱 TikTok Bio
          </Badge>
          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
            📸 Instagram Bio
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            🐦 Twitter Bio
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
