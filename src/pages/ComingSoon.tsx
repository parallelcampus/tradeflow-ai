import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
      <Card className="border-border/50 max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            {description || 'This feature is currently under development. Check back soon!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
