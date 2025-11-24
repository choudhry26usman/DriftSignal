import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SiAmazon, SiShopify, SiWalmart } from "react-icons/si";

interface ImportProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportProductModal({ open, onOpenChange }: ImportProductModalProps) {
  const [productUrl, setProductUrl] = useState("");
  const [marketplace, setMarketplace] = useState<string>("");
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async ({ url, marketplace }: { url: string; marketplace: string }) => {
      let endpoint = "";
      
      if (marketplace === "Amazon") {
        endpoint = "/api/amazon/import-reviews";
      } else if (marketplace === "Walmart") {
        endpoint = "/api/walmart/import-reviews";
      } else if (marketplace === "Shopify") {
        endpoint = "/api/shopify/import-reviews";
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import product reviews');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.imported} reviews from ${marketplace}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/imported'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/tracked'] });
      onOpenChange(false);
      setProductUrl("");
      setMarketplace("");
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImport = () => {
    if (!productUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a product URL.",
        variant: "destructive",
      });
      return;
    }

    if (!marketplace) {
      toast({
        title: "Marketplace Required",
        description: "Please select which marketplace this product is from.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Import Started",
      description: `Fetching ${marketplace} product reviews... This may take a few moments.`,
    });

    importMutation.mutate({ url: productUrl, marketplace });
  };

  const getPlaceholder = () => {
    if (marketplace === "Amazon") {
      return "https://www.amazon.com/dp/B08N5WRWNW";
    } else if (marketplace === "Walmart") {
      return "https://www.walmart.com/ip/Xbox-Series-X/443574645";
    } else if (marketplace === "Shopify") {
      return "https://yourstore.myshopify.com/products/product-name";
    }
    return "Select a marketplace first...";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="modal-import-product">
        <DialogHeader>
          <DialogTitle>Import Product Reviews</DialogTitle>
          <DialogDescription>
            Import reviews from a marketplace product URL. We'll fetch the product details and reviews automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="marketplace">Marketplace</Label>
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger id="marketplace" data-testid="select-marketplace">
                <SelectValue placeholder="Select marketplace..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Amazon">
                  <div className="flex items-center gap-2">
                    <SiAmazon className="h-4 w-4" />
                    Amazon
                  </div>
                </SelectItem>
                <SelectItem value="Walmart">
                  <div className="flex items-center gap-2">
                    <SiWalmart className="h-4 w-4" />
                    Walmart
                  </div>
                </SelectItem>
                <SelectItem value="Shopify">
                  <div className="flex items-center gap-2">
                    <SiShopify className="h-4 w-4" />
                    Shopify
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              type="url"
              placeholder={getPlaceholder()}
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              disabled={!marketplace || importMutation.isPending}
              data-testid="input-product-url"
            />
            <p className="text-xs text-muted-foreground">
              Paste the full product URL from the marketplace
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importMutation.isPending}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={importMutation.isPending || !marketplace || !productUrl.trim()}
            data-testid="button-import-product"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Import Reviews
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
