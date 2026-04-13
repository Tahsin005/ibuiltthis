import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CompassIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
      <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <CompassIcon className="size-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't seem to find the page you're looking for. It might have been moved or doesn't exist anymore.
      </p>
      <Button asChild>
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
}
