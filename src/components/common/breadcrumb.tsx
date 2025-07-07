"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with dashboard
    if (segments[0] === 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard'
      });

      if (segments.length === 1) {
        breadcrumbs[0].isActive = true;
        return breadcrumbs;
      }

      // Handle team routes
      if (segments[1] === 'team' && segments[2]) {
        breadcrumbs.push({
          label: 'Team',
          href: `/dashboard/team/${segments[2]}`
        });

        if (segments.length === 3) {
          breadcrumbs[1].isActive = true;
          return breadcrumbs;
        }

        // Handle project routes within team
        if (segments[3] === 'project' && segments[4]) {
          breadcrumbs.push({
            label: 'Project',
            href: `/dashboard/team/${segments[2]}/project/${segments[4]}`
          });

          if (segments.length === 5) {
            breadcrumbs[2].isActive = true;
            return breadcrumbs;
          }

          // Handle form routes within project
          if (segments[5] === 'form' && segments[6]) {
            breadcrumbs.push({
              label: 'Form',
              href: `/dashboard/team/${segments[2]}/project/${segments[4]}/form/${segments[6]}`
            });

            if (segments.length === 7) {
              breadcrumbs[3].isActive = true;
              return breadcrumbs;
            }

            // Handle form actions (preview, edit, analytics)
            if (segments[7]) {
              const actionLabels: Record<string, string> = {
                'preview': 'Preview',
                'edit': 'Edit',
                'analytics': 'Analytics',
                'settings': 'Settings'
              };

              breadcrumbs.push({
                label: actionLabels[segments[7]] || segments[7],
                isActive: true
              });
            }
          }
        }
      }

      // Handle direct routes (legacy support)
      if (segments[1] === 'project' && segments[2]) {
        breadcrumbs.push({
          label: 'Project',
          href: `/dashboard/project/${segments[2]}`
        });

        if (segments.length === 3) {
          breadcrumbs[1].isActive = true;
          return breadcrumbs;
        }
      }

      if (segments[1] === 'form' && segments[2]) {
        breadcrumbs.push({
          label: 'Form',
          href: `/dashboard/form/${segments[2]}`
        });

        if (segments.length === 3) {
          breadcrumbs[1].isActive = true;
          return breadcrumbs;
        }

        // Handle form actions
        if (segments[3]) {
          const actionLabels: Record<string, string> = {
            'preview': 'Preview',
            'edit': 'Edit',
            'analytics': 'Analytics',
            'settings': 'Settings'
          };

          breadcrumbs.push({
            label: actionLabels[segments[3]] || segments[3],
            isActive: true
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href && !item.isActive ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              item.isActive && "text-foreground font-medium"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
