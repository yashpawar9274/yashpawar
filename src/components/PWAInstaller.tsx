
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm z-50 animate-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm">📱 Add to Home Screen</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Add this portfolio to your home screen for quick access. Works offline and provides an app-like experience.
      </p>
      <div className="space-y-2">
        <Button onClick={handleInstall} size="sm" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Add to Home Screen
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          ✓ Works offline • ✓ Fast loading • ✓ App-like experience
        </p>
      </div>
    </div>
  );
};

export default PWAInstaller;
