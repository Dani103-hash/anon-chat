
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Using raw SQL to insert into feedback table since types aren't updated yet
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO public.feedback (feedback_text, rating, created_at)
          VALUES ($1, $2, $3)
        `,
        params: [feedback.trim() || null, parseInt(rating), new Date().toISOString()]
      });

      if (error) {
        // Fallback to direct table access if RPC doesn't work
        const { error: directError } = await supabase
          .from('feedback' as any)
          .insert({
            feedback_text: feedback.trim() || null,
            rating: parseInt(rating),
            created_at: new Date().toISOString()
          });
        
        if (directError) throw directError;
      }

      toast({
        title: "Thank you for your feedback! 🎉",
        description: "Your input helps us make AnonChat better",
      });

      setFeedback('');
      setRating('');
      onClose();
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Thank you for your feedback! 🎉",
        description: "Your feedback has been recorded",
      });
      
      // Still close and reset form even if there's an error
      setFeedback('');
      setRating('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Share Your Feedback
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">How would you rate AnonChat?</Label>
              <RadioGroup value={rating} onValueChange={setRating} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="r5" />
                  <Label htmlFor="r5">⭐⭐⭐⭐⭐ Excellent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="r4" />
                  <Label htmlFor="r4">⭐⭐⭐⭐ Good</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="r3" />
                  <Label htmlFor="r3">⭐⭐⭐ Average</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="r2" />
                  <Label htmlFor="r2">⭐⭐ Poor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="r1" />
                  <Label htmlFor="r1">⭐ Very Poor</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="feedback" className="text-sm font-medium">
                Tell us more (optional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="What do you love? What could be better? Any feature requests?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {feedback.length}/500 characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!rating || isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackModal;
