import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ToolCard({ title, description, icon: Icon, children, className, onClick }: ToolCardProps) {
  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50", 
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <div className="h-12 w-12 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-gray-700 leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 line-clamp-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      {children && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
