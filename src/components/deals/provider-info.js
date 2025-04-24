import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Mail } from 'lucide-react';

export function ProviderInfo({ provider }) {
  if (!provider) return null;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start space-y-0 gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={provider.logo_url} alt={provider.company_name} />
          <AvatarFallback>
            <Building2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{provider.company_name}</CardTitle>
          <CardDescription>Travel Provider</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {provider.description && (
          <p className="text-sm text-muted-foreground">
            {provider.description}
          </p>
        )}
        
        <div className="flex flex-col space-y-2">
          {provider.website && (
            <a 
              href={provider.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center"
            >
              <Building2 className="mr-2 h-4 w-4" />
              {provider.website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          
          {provider.contact_email && (
            <a 
              href={`mailto:${provider.contact_email}`}
              className="text-sm text-primary hover:underline flex items-center"
            >
              <Mail className="mr-2 h-4 w-4" />
              {provider.contact_email}
            </a>
          )}
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <a href={`/providers/${provider.id}`}>
            View All Deals by This Provider
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
