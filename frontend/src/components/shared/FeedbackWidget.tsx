"use client";

import { useState } from "react";
import { MessageSquarePlus, Star, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useWalletStore } from "@/stores/wallet-store";
import { useToastStore } from "@/stores/toast-store";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addFeedback } = useFeedbackStore();
  const { address } = useWalletStore();
  const { addToast } = useToastStore();

  const handleSubmit = () => {
    if (rating === 0) {
      addToast({ type: "warning", title: "Please select a rating" });
      return;
    }
    addFeedback({
      rating,
      comment,
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      walletAddress: address || undefined,
    });
    addToast({
      type: "success",
      title: "Thank you for your feedback!",
      message: "Your feedback helps us improve CarbonTrack.",
    });
    setRating(0);
    setComment("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center hover:shadow-emerald-500/40 transition-shadow"
        aria-label="Send Feedback"
      >
        <MessageSquarePlus className="w-5 h-5" />
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <MessageSquarePlus className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Share Feedback</h3>
                    <p className="text-xs text-gray-400">Help us improve CarbonTrack</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-3 block">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">
                  Tell us more (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What do you like? What can we improve?"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
