
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

const sampleMessages = [
  {
    id: 1,
    text: "What's your biggest fear?",
    response: "Probably running out of coffee in the morning! ☕",
    category: "question"
  },
  {
    id: 2,
    text: "You're actually really funny in person!",
    response: "Aww thanks! That made my day 😊",
    category: "compliment"
  },
  {
    id: 3,
    text: "Confess: I've had a crush on you since freshman year",
    response: "Wait... really? 😮 We should talk!",
    category: "confession"
  },
  {
    id: 4,
    text: "Rate my new haircut honestly",
    response: "Solid 8/10! It really suits you",
    category: "rate"
  },
  {
    id: 5,
    text: "Would you rather have wings or be invisible?",
    response: "Wings for sure! Flying would be amazing ✈️",
    category: "wouldyou"
  }
];

const MessageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showResponse) {
        // Move to next message after showing response
        setCurrentIndex((prev) => (prev + 1) % sampleMessages.length);
        setShowResponse(false);
      } else {
        // Show response for current message
        setShowResponse(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showResponse]);

  const currentMessage = sampleMessages[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
          See AnonChat in Action
        </h2>
        <p className="text-white/80 drop-shadow">
          Watch how anonymous conversations unfold
        </p>
      </div>

      <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl min-h-[200px] relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3 inline-block max-w-[80%]">
                <p className="text-gray-800">{currentMessage.text}</p>
              </div>
              <Badge 
                variant="secondary" 
                className="mt-2 text-xs bg-purple-100 text-purple-700"
              >
                {currentMessage.category}
              </Badge>
            </div>
          </div>

          <div 
            className={`transition-all duration-500 transform ${
              showResponse 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-start gap-3 justify-end">
              <div className="flex-1 flex justify-end">
                <div className="bg-purple-600 text-white rounded-lg p-3 inline-block max-w-[80%]">
                  <p>{currentMessage.response}</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {sampleMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-600 w-6' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSlideshow;
