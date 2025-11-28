import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown, Minus, Send, Save, Mail, Sparkles, Copy, ExternalLink, Check } from "lucide-react";
import { SiAmazon, SiShopify } from "react-icons/si";
import { WalmartLogo } from "@/components/WalmartLogo";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const marketplaceIcons = {
  Amazon: SiAmazon,
  Shopify: SiShopify,
  Walmart: WalmartLogo,
  Mailbox: Mail,
};

const sentimentConfig = {
  positive: { icon: ThumbsUp, color: "text-chart-2" },
  negative: { icon: ThumbsDown, color: "text-destructive" },
  neutral: { icon: Minus, color: "text-muted-foreground" },
};

interface ReviewDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: {
    id: string;
    marketplace: keyof typeof marketplaceIcons;
    title: string;
    content: string;
    customerName: string;
    customerEmail?: string;
    rating?: number;
    sentiment: keyof typeof sentimentConfig;
    category: string;
    severity: string;
    status: string;
    createdAt: Date;
    aiSuggestedReply?: string;
    aiAnalysisDetails?: string;
  };
}

const sellerPortalInfo = {
  Amazon: {
    name: "Amazon Seller Central",
    url: "https://sellercentral.amazon.com",
    path: "Performance > Customer Reviews",
  },
  Walmart: {
    name: "Walmart Seller Center", 
    url: "https://seller.walmart.com",
    path: "Reviews & Ratings",
  },
  Shopify: {
    name: "Shopify Admin",
    url: null,
    path: "Orders > Customer details",
  },
  Mailbox: null,
};

export function ReviewDetailModal({ open, onOpenChange, review }: ReviewDetailModalProps) {
  const [replyText, setReplyText] = useState(review.aiSuggestedReply || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const MarketplaceIcon = marketplaceIcons[review.marketplace];
  const SentimentIcon = sentimentConfig[review.sentiment].icon;
  
  const isEmailReview = review.marketplace === "Mailbox";
  const portalInfo = sellerPortalInfo[review.marketplace];

  const sendEmailMutation = useMutation({
    mutationFn: async (data: { to: string; subject: string; body: string }) => {
      return apiRequest("POST", "/api/send-email", data);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Your response has been sent via Outlook successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Failed to Send",
        description: "Could not send email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateAIReply = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-reply", {
        reviewContent: review.content,
        customerName: review.customerName,
        marketplace: review.marketplace,
        sentiment: review.sentiment,
        severity: review.severity,
      });
      const data = await response.json();
      setReplyText(data.reply);
      toast({
        title: "AI Reply Generated",
        description: "Professional response has been generated using Grok AI.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate AI reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = () => {
    if (!review.customerEmail) {
      toast({
        title: "No Email Address",
        description: "Customer email address is not available.",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate({
      to: review.customerEmail,
      subject: `Re: ${review.title}`,
      body: replyText,
    });
  };

  const handleCopyReply = async () => {
    if (!replyText) {
      toast({
        title: "No Reply to Copy",
        description: "Generate or write a reply first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(replyText);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: portalInfo ? `Paste this reply in ${portalInfo.name}` : "Reply copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-review-detail">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <MarketplaceIcon className="h-6 w-6" />
            <Badge variant="outline">{review.marketplace}</Badge>
            <Badge variant="secondary">{review.category}</Badge>
          </div>
          <DialogTitle className="text-2xl">{review.title}</DialogTitle>
          <DialogDescription>
            Review from {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
            <TabsTrigger value="analysis" data-testid="tab-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="response" data-testid="tab-response">Response</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className={cn("flex items-center gap-2", sentimentConfig[review.sentiment].color)}>
                <SentimentIcon className="h-5 w-5" />
                <span className="font-medium capitalize">{review.sentiment}</span>
              </div>
              {review.rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{review.rating}/5</span>
                </div>
              )}
              <Badge>{review.severity} severity</Badge>
              <Badge variant="outline" className="capitalize">{review.status.replace("_", " ")}</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{review.content}</p>
              </CardContent>
            </Card>

            {isEmailReview && review.customerEmail && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {review.customerEmail}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  let analysisDetails = null;
                  try {
                    analysisDetails = review.aiAnalysisDetails ? JSON.parse(review.aiAnalysisDetails) : null;
                  } catch (e) {
                    console.error("Failed to parse AI analysis details:", e);
                  }

                  return (
                    <>
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                          Overview
                        </h4>
                        <div className="space-y-2 pl-7">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Primary concern:</span>
                            <span className="font-medium">{review.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Sentiment:</span>
                            <span className="font-medium capitalize">{review.sentiment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Severity:</span>
                            <span className="font-medium capitalize">{review.severity}</span>
                          </div>
                          {analysisDetails?.customerEmotion && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Customer emotion:</span>
                              <span className="font-medium capitalize">{analysisDetails.customerEmotion}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {analysisDetails?.specificIssues && analysisDetails.specificIssues.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs">2</span>
                            Specific Issues
                          </h4>
                          <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-7">
                            {analysisDetails.specificIssues.map((issue: string, i: number) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisDetails?.positiveAspects && analysisDetails.positiveAspects.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs">+</span>
                            Positive Aspects
                          </h4>
                          <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-7">
                            {analysisDetails.positiveAspects.map((aspect: string, i: number) => (
                              <li key={i}>{aspect}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisDetails?.keyPhrases && analysisDetails.keyPhrases.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs">"</span>
                            Key Customer Phrases
                          </h4>
                          <div className="space-y-2 pl-7">
                            {analysisDetails.keyPhrases.map((phrase: string, i: number) => (
                              <p key={i} className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                                "{phrase}"
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisDetails?.urgencyLevel && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs">!</span>
                            Urgency Assessment
                          </h4>
                          <p className="text-sm text-muted-foreground pl-7">{analysisDetails.urgencyLevel}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">→</span>
                          Recommended Actions
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-7">
                          {analysisDetails?.recommendedActions && analysisDetails.recommendedActions.length > 0 ? (
                            analysisDetails.recommendedActions.map((action: string, i: number) => (
                              <li key={i}>{action}</li>
                            ))
                          ) : (
                            <>
                              <li>Respond within 24 hours to maintain customer satisfaction</li>
                              <li>Acknowledge the specific issue mentioned in the review</li>
                              <li>Offer a resolution or compensation if applicable</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI-Suggested Response</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIReply}
                  disabled={isGenerating}
                  data-testid="button-generate-ai-reply"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate AI Reply"}
                </Button>
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-40"
                placeholder="AI-generated response will appear here..."
                data-testid="textarea-response"
              />
              {isEmailReview ? (
                <p className="text-xs text-muted-foreground">
                  Edit the AI-generated response before sending via Outlook
                </p>
              ) : portalInfo && (
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <ExternalLink className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium">How to respond to this review:</p>
                        <p className="text-muted-foreground mt-1">
                          1. Copy the reply below using the button
                        </p>
                        <p className="text-muted-foreground">
                          2. Go to <span className="font-medium text-foreground">{portalInfo.name}</span>
                          {portalInfo.url && (
                            <a 
                              href={portalInfo.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-1"
                            >
                              (Open)
                            </a>
                          )}
                        </p>
                        <p className="text-muted-foreground">
                          3. Navigate to <span className="font-medium text-foreground">{portalInfo.path}</span>
                        </p>
                        <p className="text-muted-foreground">
                          4. Find this review and paste your response
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" data-testid="button-save-draft">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {isEmailReview ? (
                <Button 
                  className="flex-1" 
                  onClick={handleSendReply}
                  disabled={sendEmailMutation.isPending || !replyText}
                  data-testid="button-send-reply"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendEmailMutation.isPending ? "Sending..." : "Send via Outlook"}
                </Button>
              ) : (
                <Button 
                  className="flex-1" 
                  onClick={handleCopyReply}
                  disabled={!replyText}
                  data-testid="button-copy-reply"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Reply
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
