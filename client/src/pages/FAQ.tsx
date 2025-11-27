import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Upload, 
  LayoutDashboard, 
  Workflow, 
  BarChart3, 
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Mail,
  Filter,
  RefreshCw,
  Trash2,
  Play
} from "lucide-react";
import { SiAmazon, SiShopify, SiWalmart } from "react-icons/si";
import { useTour } from "@/hooks/use-tour";

const gettingStartedSteps = [
  {
    step: 1,
    title: "Sign In",
    description: "Click 'Get Started' on the landing page to sign in with your Replit account. Your data is private and only visible to you."
  },
  {
    step: 2,
    title: "Import Your First Product",
    description: "Click 'Import Reviews' in the sidebar, select a marketplace (Amazon, Walmart, Shopify, or upload a file), and enter your product URL or ID."
  },
  {
    step: 3,
    title: "Review AI Analysis",
    description: "Each imported review is automatically analyzed by AI for sentiment (positive/neutral/negative), category, and severity level."
  },
  {
    step: 4,
    title: "Manage Workflow",
    description: "Use the Workflow Board to drag reviews between 'Open', 'In Progress', and 'Resolved' columns to track your response progress."
  },
  {
    step: 5,
    title: "Track Analytics",
    description: "View the Analytics page for insights on rating distributions, sentiment trends, and category breakdowns."
  }
];

const faqItems = [
  {
    category: "Importing Reviews",
    questions: [
      {
        q: "How do I import Amazon reviews?",
        a: "Click 'Import Reviews' in the sidebar, select 'Amazon', then paste the product URL (e.g., https://amazon.com/dp/B0XXXXXXXX) or just the ASIN code. Click 'Import' and wait for the reviews to be fetched and analyzed."
      },
      {
        q: "How many reviews can I import?",
        a: "Amazon imports typically fetch 8-10 reviews per product. Walmart fetches up to 10 reviews. You can refresh products periodically to capture new reviews as they come in."
      },
      {
        q: "Can I import reviews from a CSV or JSON file?",
        a: "Yes! Click 'Import Reviews', select 'File Upload', then drag and drop your CSV or JSON file. The system will process each review through AI analysis automatically."
      },
      {
        q: "What is the Mailbox option?",
        a: "Mailbox connects to your Outlook email to import customer feedback and complaints received via email. This requires connecting your Microsoft account in Settings first."
      },
      {
        q: "How do I refresh reviews for an existing product?",
        a: "On the Dashboard, find your product card and click the refresh icon. This will fetch any new reviews that have been posted since your last import."
      }
    ]
  },
  {
    category: "Understanding AI Analysis",
    questions: [
      {
        q: "What does the AI analyze in each review?",
        a: "The AI analyzes three key aspects: Sentiment (positive, neutral, or negative), Category (one of 12 product issue categories like 'Product Quality', 'Shipping & Delivery', etc.), and Severity (low, medium, high, or critical)."
      },
      {
        q: "What are the 12 product categories?",
        a: "The categories are: Product Quality, Shipping & Delivery, Customer Service, Pricing & Value, Product Features, Packaging, Sizing & Fit, Compatibility, Documentation, Returns & Refunds, Safety Concerns, and General Feedback."
      },
      {
        q: "How is severity determined?",
        a: "Severity is based on the urgency and impact: Low (minor observations), Medium (standard complaints), High (significant issues requiring attention), and Critical (safety concerns or major problems)."
      },
      {
        q: "Does the AI suggest replies?",
        a: "Yes! Each review includes an AI-suggested reply that you can use as a starting point. You can edit the reply before sending it to the customer."
      }
    ]
  },
  {
    category: "Using the Dashboard",
    questions: [
      {
        q: "How do I filter reviews?",
        a: "Use the sidebar marketplace buttons to filter by platform, or click 'Advanced Filters' for more options like date range, sentiment, status, rating, and category."
      },
      {
        q: "What do the stat cards show?",
        a: "The stat cards at the top show: Total Reviews (all imported), Average Rating (mean star rating), Negative Reviews (count of negative sentiment), and Open Issues (reviews not yet resolved)."
      },
      {
        q: "How do I view review details?",
        a: "Click on any review card to open the detail modal. Here you can see the full review, AI analysis, suggested reply, and update the status."
      },
      {
        q: "How do I delete a product and its reviews?",
        a: "Click the trash icon on any product card. You'll be asked whether to delete just the product tracking or also all associated reviews."
      }
    ]
  },
  {
    category: "Workflow Management",
    questions: [
      {
        q: "What is the Workflow Board?",
        a: "The Workflow Board is a Kanban-style interface where reviews are organized into three columns: Open (new reviews needing attention), In Progress (currently being handled), and Resolved (completed)."
      },
      {
        q: "How do I move a review between columns?",
        a: "Simply drag and drop a review card from one column to another. The status will be automatically updated."
      },
      {
        q: "Can I see review details from the Workflow Board?",
        a: "Yes! Click on any card in the Workflow Board to open the full review detail modal with all information and AI suggestions."
      }
    ]
  },
  {
    category: "Analytics",
    questions: [
      {
        q: "What charts are available?",
        a: "Analytics includes: Rating Distribution (bar chart of 1-5 star reviews), Status Distribution (pie chart of open/in-progress/resolved), and Weekly Review Trends (line chart over time)."
      },
      {
        q: "Can I filter analytics data?",
        a: "Yes! All analytics respect the current filters applied from the sidebar or Advanced Filters modal, including marketplace, date range, sentiment, and more."
      },
      {
        q: "Can I export my data?",
        a: "Yes! Use the 'Export' feature in Advanced Filters to download your filtered reviews as a CSV file for external analysis."
      }
    ]
  },
  {
    category: "Settings & Integrations",
    questions: [
      {
        q: "How do I check if my integrations are working?",
        a: "Go to Settings to see the status of all connected services: AI (OpenRouter), Amazon (Axesso), Walmart (SerpAPI), and Outlook email. Green checkmarks indicate active connections."
      },
      {
        q: "How do I connect my Outlook email?",
        a: "In Settings, click 'Connect Outlook' to authorize access to your Microsoft account. Once connected, you can import customer emails from the Mailbox option."
      },
      {
        q: "Can I use dark mode?",
        a: "Yes! Click the theme toggle button in the top-right corner of the header to switch between light and dark modes."
      }
    ]
  }
];

const troubleshootingItems = [
  {
    issue: "Reviews not importing",
    solution: "Make sure you're using a valid product URL or ASIN. For Amazon, the URL should contain '/dp/' followed by a 10-character code. Check Settings to verify your API integrations are active."
  },
  {
    issue: "No reviews found for product",
    solution: "Some products may not have reviews yet, or the reviews may not have text content (rating-only reviews are not imported). Try a different product or wait for more reviews to be posted."
  },
  {
    issue: "AI analysis seems incorrect",
    solution: "AI analysis is based on the review text content. Very short or ambiguous reviews may result in less accurate categorization. The system uses standardized categories for consistency."
  },
  {
    issue: "Can't connect Outlook",
    solution: "Ensure you're using a valid Microsoft account. Check that pop-up blockers aren't preventing the authorization window. Try signing out and back in to refresh your session."
  }
];

export default function FAQ() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { startTour } = useTour();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Help & FAQ
          </h1>
          <p className="text-sm text-muted-foreground">
            Learn how to use DriftSignal to manage your marketplace reviews effectively
          </p>
        </div>
        <Button 
          onClick={startTour}
          className="flex items-center gap-2 whitespace-nowrap"
          data-testid="button-start-tour"
        >
          <Play className="h-4 w-4" />
          Start Tour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Follow these steps to start managing your reviews in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gettingStartedSteps.map((item, index) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pb-4 border-b last:border-0">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Supported Marketplaces
          </CardTitle>
          <CardDescription>
            Import reviews from these platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <SiAmazon className="h-8 w-8" style={{ color: "#FF9900" }} />
              <span className="font-medium">Amazon</span>
              <span className="text-xs text-muted-foreground text-center">Product URL or ASIN</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <SiWalmart className="h-8 w-8" style={{ color: "#0071CE" }} />
              <span className="font-medium">Walmart</span>
              <span className="text-xs text-muted-foreground text-center">Product URL or ID</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <SiShopify className="h-8 w-8" style={{ color: "#7AB55C" }} />
              <span className="font-medium">Shopify</span>
              <span className="text-xs text-muted-foreground text-center">Store URL + Product</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <Mail className="h-8 w-8" style={{ color: "#0078D4" }} />
              <span className="font-medium">Mailbox</span>
              <span className="text-xs text-muted-foreground text-center">Outlook emails</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            AI Analysis Categories
          </CardTitle>
          <CardDescription>
            Reviews are automatically classified into these 12 categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Product Quality",
              "Shipping & Delivery", 
              "Customer Service",
              "Pricing & Value",
              "Product Features",
              "Packaging",
              "Sizing & Fit",
              "Compatibility",
              "Documentation",
              "Returns & Refunds",
              "Safety Concerns",
              "General Feedback"
            ].map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        
        {faqItems.map((section) => (
          <Card key={section.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${section.category}-${index}`}>
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Common issues and how to resolve them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshootingItems.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-destructive">{item.issue}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the marketplace filter in the sidebar to quickly focus on reviews from a specific platform</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Regularly refresh your products to capture new reviews as customers post them</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the Workflow Board to track which reviews you've responded to</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Export filtered data as CSV for team sharing or external reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Check Analytics weekly to spot trends in customer sentiment and common issues</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
