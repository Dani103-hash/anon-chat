
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const sampleMessages = [
  {
    text: "What's your biggest fear?",
    type: "question"
  },
  {
    text: "I think you're really cool but I'm too shy to say it in person 😊",
    type: "confession"
  },
  {
    text: "Your presentation yesterday was amazing! You should be proud",
    type: "compliment"
  },
  {
    text: "Can you roast my terrible music taste?",
    type: "roast"
  },
  {
    text: "I've had a crush on you since freshman year...",
    type: "confession"
  },
  {
    text: "What would you do if you won the lottery tomorrow?",
    type: "question"
  },
  {
    text: "Your laugh is contagious and brightens everyone's day ✨",
    type: "compliment"
  },
  {
    text: "Tell me something you've never told anyone",
    type: "question"
  }
];

const MessageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sampleMessages.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'confession':
        return 'from-pink-400 to-rose-400';
      case 'question':
        return 'from-blue-400 to-indigo-400';
      case 'compliment':
        return 'from-green-400 to-emerald-400';
      case 'roast':
        return 'from-orange-400 to-red-400';
      default:
        return 'from-purple-400 to-pink-400';
    }
  };

  const currentMessage = sampleMessages[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-lg">
        Messages people are sending
      </h2>
      
      <Card className={`bg-gradient-to-r ${getTypeColor(currentMessage.type)} border-0 shadow-2xl transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
      }`}>
        <div className="p-8 text-center">
          <div className="bg-white/20 backdrop-blur rounded-lg p-6">
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
              "{currentMessage.text}"
            </p>
          </div>
          
          <div className="mt-4 flex justify-center space-x-2">
            {sampleMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
      
      <p className="text-white/80 text-center mt-4 text-sm">
        Real anonymous messages sent on AnonChat
      </p>
    </div>
  );
};

export default MessageSlideshow;
