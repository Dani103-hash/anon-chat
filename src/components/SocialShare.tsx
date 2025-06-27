
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  username: string;
}

const SocialShare = ({ username }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/${username}`;
  const shareText = `Send me anonymous messages at ${shareUrl} 🕶️✨`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied! 📋",
        description: "Share this link to receive anonymous messages",
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Link copied! 📋",
          description: "Share this link to receive anonymous messages",
        });
      } catch (fallbackErr) {
        toast({
          title: "Copy failed",
          description: "Please manually copy the link below",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareUrl_platform = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl_platform = `https://wa.me/?text=${encodedText}`;
        break;
      case 'telegram':
        shareUrl_platform = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl_platform, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Send me anonymous messages!',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5 text-purple-600 animate-pulse" />
          Share Your Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 text-sm bg-gradient-to-r from-gray-50 to-purple-50 border-purple-200 focus:border-purple-400 transition-all duration-300"
          />
          <Button
            onClick={handleCopyLink}
            size="sm"
            variant="outline"
            className="px-3 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-110"
          >
            {copied ? <Check className="w-4 h-4 text-green-500 animate-bounce" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleNativeShare}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-4 h-4 mr-1 animate-pulse" />
            Share
          </Button>
          <Button
            onClick={() => window.open(shareUrl, '_blank')}
            size="sm"
            variant="outline"
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleSocialShare('twitter')}
            size="sm" 
            variant="outline"
            className="text-blue-500 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-md"
          >
            Twitter (X)
          </Button>
          <Button 
            onClick={() => handleSocialShare('facebook')}
            size="sm" 
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-md"
          >
            Facebook
          </Button>
          <Button 
            onClick={() => handleSocialShare('whatsapp')}
            size="sm" 
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transform hover:scale-105 transition-all duration-300 hover:shadow-md"
          >
            WhatsApp
          </Button>
          <Button 
            onClick={() => handleSocialShare('telegram')}
            size="sm" 
            variant="outline"
            className="text-blue-400 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-md"
          >
            Telegram
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
