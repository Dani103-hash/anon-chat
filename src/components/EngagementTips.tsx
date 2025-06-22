
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Bell, Shield } from "lucide-react";

const tips = [
  {
    icon: Share2,
    title: "Use your social username",
    description: "Use your Instagram or TikTok username so friends can find you easily",
    color: "bg-blue-100 text-blue-800"
  },
  {
    icon: MessageSquare,
    title: "Share your link",
    description: "Add your AnonChat link to your bio or story to start getting messages",
    color: "bg-purple-100 text-purple-800"
  },
  {
    icon: Bell,
    title: "Enable notifications",
    description: "Never miss a message - turn on push notifications",
    color: "bg-green-100 text-green-800"
  },
  {
    icon: Shield,
    title: "Secure your account",
    description: "Sign in with Google to keep your messages safe forever",
    color: "bg-orange-100 text-orange-800"
  }
];

const EngagementTips = () => {
  return (
    <div className="w-full">
      <h3 className="text-white font-semibold text-center mb-4 drop-shadow">
        💡 Tips for Better Experience
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <Card key={index} className="bg-white/90 backdrop-blur border-0 hover:bg-white/95 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className={`${tip.color} mb-2 text-xs`}>
                      {tip.title}
                    </Badge>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EngagementTips;
