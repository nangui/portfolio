---
title: "Architecture Next.js : Une approche par couches pour des composants testables"
slug: "architecture-nextjs-couches-testabilite"
description: "Découvrez comment structurer une application Next.js avec une architecture en couches claire, une organisation de dossiers cohérente et des composants hautement testables. Guide pratique avec exemples pour une application de gestion de centre de formation."
pubDate: 2025-01-17T00:00:00.000Z
tags: ["Next.js", "Architecture", "Clean Architecture", "Testing", "TypeScript", "Frontend"]
image: "/images/nextjs-architecture.png"
---

## Introduction

Lorsqu'on développe une application Next.js de taille moyenne à grande, la question de l'architecture devient rapidement centrale. Comment organiser le code pour qu'il reste maintenable, testable et évolutif ? Comment séparer les responsabilités sans créer une complexité inutile ?

Dans cet article, je vais vous présenter une architecture en couches que j'ai mise en pratique avec succès, basée sur les principes de **Clean Architecture** et adaptée aux spécificités de Next.js. Cette approche privilégie la **testabilité** et la **séparation des responsabilités**, tout en restant pragmatique et applicable à des projets réels.

Nous utiliserons comme exemple une **application de gestion de centre de formation** pour illustrer les concepts avec des cas d'usage concrets.

## Les Principes Fondamentaux

### 1. Séparation des Couches

L'architecture que je propose s'articule autour de **5 couches principales** :

1. **Présentation** : Composants UI et pages
2. **ViewModels** : Hooks qui orchestrent la logique métier
3. **Services** : Logique métier pure, sans dépendances React
4. **Adapters** : Abstraction des services externes
5. **Infrastructure** : Configuration, contextes, providers

### 2. Testabilité Avant Tout

Chaque couche doit être **indépendamment testable** :
- Les services sont des fonctions pures, facilement testables
- Les adapters utilisent des interfaces, permettant le mocking
- Les ViewModels orchestrent sans dépendre directement de React
- Les composants UI sont de purs composants de présentation

### 3. Organisation par Domaine

Au lieu d'organiser par type technique (`components/`, `utils/`, `hooks/`), nous organisons par **domaine métier** (`students/`, `courses/`, `instructors/`). Chaque domaine contient ses propres composants, hooks, services et types.

## Structure des Dossiers

Voici la structure de dossiers recommandée pour une application Next.js moderne :

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalization
│   │   ├── (auth)/              # Auth routes group
│   │   ├── students/            # Student pages
│   │   ├── courses/             # Course pages
│   │   └── instructors/         # Instructor pages
│   ├── api/                      # API routes
│   │   ├── students/
│   │   └── courses/
│   └── layout.tsx               # Root layout
│
├── components/                   # Composants React
│   ├── students/                 # Domain: Students
│   │   ├── StudentList.tsx
│   │   ├── StudentDetail.tsx
│   │   ├── hooks/
│   │   │   └── useStudentViewModel.ts
│   │   ├── services/
│   │   │   ├── studentFormatter.ts
│   │   │   └── studentStatusHelper.ts
│   │   └── shared/
│   │       └── StudentHeader.tsx
│   ├── courses/                  # Domain: Courses
│   ├── ui/                       # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── DataTable.tsx
│   │   └── SearchField.tsx
│   └── providers/                # Context providers
│       ├── QueryProvider.tsx
│       └── ThemeProvider.tsx
│
├── hooks/                        # Hooks métier globaux
│   ├── useStudents.ts
│   ├── useCourses.ts
│   └── useInstructors.ts
│
├── lib/                          # Bibliothèques et configuration
│   ├── api/                      # API clients
│   │   ├── client.ts
│   │   └── queries/
│   │       ├── students.ts
│   │       └── courses.ts
│   ├── query/                    # TanStack Query config
│   │   ├── query-client.ts
│   │   └── query-keys.ts
│   └── utils/                    # Utilitaires
│       ├── date-formatter.ts
│       └── error-handling.ts
│
├── adapters/                     # Adapters pour services externes
│   ├── analytics/
│   │   ├── AnalyticsAdapter.ts
│   │   ├── types.ts
│   │   └── __mocks__/
│   │       └── AnalyticsAdapter.mock.ts
│   └── notifications/
│       └── NotificationAdapter.ts
│
├── contexts/                     # React Contexts
│   ├── AdapterContext.tsx
│   └── RepositoryContext.tsx
│
├── types/                        # Types TypeScript globaux
│   ├── api.ts
│   └── index.ts
│
└── test/                         # Utilitaires de test
    └── test-utils.tsx
```

## Les Couches en Détail

### Couche 1 : Services (Logique Métier Pure)

Les services contiennent la **logique métier pure**, sans aucune dépendance à React ou au DOM. Ils sont 100% testables avec de simples tests unitaires.

**Exemple : `studentFormatter.ts`**

```typescript
/**
 * Student Formatter Service
 * 
 * Pure business logic for formatting student data
 * No React, no DOM, 100% testable with unit tests
 */

import type { Student } from '@/types/api';

export const studentFormatter = {
  /**
   * Calculate student's full name
   */
  getFullName(student: Student): string {
    return `${student.firstName || ''} ${student.lastName || ''}`.trim();
  },

  /**
   * Calculate student's initials
   */
  getInitials(student: Student): string {
    const firstInitial = student.firstName?.[0] || '';
    const lastInitial = student.lastName?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  },

  /**
   * Format student's enrollment date
   */
  getEnrollmentDate(student: Student): string {
    if (!student.enrolledAt) return 'Not enrolled';
    
    const date = new Date(student.enrolledAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format student's program status
   */
  getProgramStatus(student: Student): {
    label: string;
    color: 'success' | 'warning' | 'error' | 'info';
  } {
    if (student.completedAt) {
      return { label: 'Completed', color: 'success' };
    }
    if (student.suspendedAt) {
      return { label: 'Suspended', color: 'error' };
    }
    if (student.enrolledAt) {
      return { label: 'Active', color: 'info' };
    }
    return { label: 'Pending', color: 'warning' };
  },
};
```

**Test unitaire correspondant :**

```typescript
import { describe, it, expect } from 'vitest';
import { studentFormatter } from './studentFormatter';

describe('studentFormatter', () => {
  describe('getFullName', () => {
    it('should return full name when both names provided', () => {
      const student = { firstName: 'John', lastName: 'Doe' };
      expect(studentFormatter.getFullName(student)).toBe('John Doe');
    });

    it('should handle missing last name', () => {
      const student = { firstName: 'John' };
      expect(studentFormatter.getFullName(student)).toBe('John');
    });
  });

  describe('getInitials', () => {
    it('should return uppercase initials', () => {
      const student = { firstName: 'John', lastName: 'Doe' };
      expect(studentFormatter.getInitials(student)).toBe('JD');
    });
  });

  describe('getProgramStatus', () => {
    it('should return completed status', () => {
      const student = { completedAt: '2024-01-01' };
      const status = studentFormatter.getProgramStatus(student);
      expect(status.label).toBe('Completed');
      expect(status.color).toBe('success');
    });
  });
});
```

### Couche 2 : ViewModels (Orchestration)

Les ViewModels sont des hooks qui **orchestrent** la logique métier en utilisant les services. Ils préparent les données pour la présentation.

**Exemple : `useStudentViewModel.ts`**

```typescript
/**
 * Student ViewModel Hook
 *
 * Orchestrates business logic for student views
 * Follows Clean Architecture's ViewModel pattern
 * Testable with simple unit tests
 */

import { useMemo } from 'react';

import type { Student } from '@/types/api';

import { studentFormatter } from '../services/studentFormatter';

export interface StudentViewModel {
  fullName: string;
  initials: string;
  enrollmentDate: string;
  programStatus: {
    label: string;
    color: 'success' | 'warning' | 'error' | 'info';
  };
  infoCards: Array<{
    icon: 'calendar' | 'book' | 'person';
    label: string;
    value: string;
  }>;
  raw: Student;
}

/**
 * Hook that orchestrates business logic for student view
 * Returns formatted data ready for presentation
 */
export function useStudentViewModel(
  student: Student | null | undefined
): StudentViewModel | null {
  return useMemo(() => {
    if (!student) {
      return null;
    }

    // Use services to format data
    const fullName = studentFormatter.getFullName(student);
    const initials = studentFormatter.getInitials(student);
    const enrollmentDate = studentFormatter.getEnrollmentDate(student);
    const programStatus = studentFormatter.getProgramStatus(student);

    // Build info cards data
    const infoCards = [
      {
        icon: 'calendar' as const,
        label: 'ENROLLMENT DATE',
        value: enrollmentDate,
      },
      {
        icon: 'book' as const,
        label: 'PROGRAM',
        value: student.programName || 'Not assigned',
      },
      {
        icon: 'person' as const,
        label: 'INSTRUCTOR',
        value: student.instructorName || 'Not assigned',
      },
    ];

    return {
      fullName,
      initials,
      enrollmentDate,
      programStatus,
      infoCards,
      raw: student,
    };
  }, [student]);
}
```

### Couche 3 : Composants de Présentation

Les composants UI sont de **purs composants de présentation**. Ils reçoivent des données formatées et se contentent de les afficher.

**Exemple : `StudentHeader.tsx`**

```typescript
/**
 * StudentHeader Component
 * 
 * Reusable header for displaying student information with action buttons
 * Pure presentation component - no business logic
 */

import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Avatar, Box, Chip, IconButton, Stack, Typography } from '@mui/material';

interface StudentHeaderProps {
  initials: string;
  fullName: string;
  program: string;
  programStatus: {
    label: string;
    color: 'success' | 'warning' | 'error' | 'info';
  };
  onEdit?: () => void;
  onOpenInNew?: () => void;
}

/**
 * Display student header with avatar, name, status chip, and action buttons
 */
export function StudentHeader({
  initials,
  fullName,
  program,
  programStatus,
  onEdit,
  onOpenInNew,
}: StudentHeaderProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      {/* Left section: Avatar + Name + Status + Program */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: '#004151',
            fontSize: '1.125rem',
            fontWeight: 600,
          }}
        >
          {initials}
        </Avatar>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {fullName}
            </Typography>
            
            <Chip
              label={programStatus.label}
              size="small"
              color={programStatus.color}
            />
          </Stack>
          
          <Typography variant="body2" sx={{ color: '#666' }}>
            {program}
          </Typography>
        </Box>
      </Stack>

      {/* Right section: Action buttons */}
      <Stack direction="row" spacing={0.5}>
        {onEdit && (
          <IconButton
            size="small"
            aria-label="Edit student"
            onClick={onEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onOpenInNew && (
          <IconButton
            size="small"
            aria-label="Open in new tab"
            onClick={onOpenInNew}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
```

**Note sur les bibliothèques UI :** Le choix de la bibliothèque UI est flexible. Vous pouvez utiliser :
- **shadcn/ui** : Composants accessibles basés sur Radix UI
- **Chakra UI** : Système de design modulaire et accessible
- **Prime React** : Suite complète de composants enterprise
- **Tailwind CSS** : Utility-first CSS framework
- **Pure Design System** : Système de design basé sur les standards web avec Web Components (voir [Pure Design System Storybook](https://puredesignsystem.z6.web.core.windows.net/#overview))

### Couche 4 : Adapters (Abstraction des Services Externes)

Les adapters permettent d'**abstraire** les services externes (analytics, notifications, etc.) derrière une interface, facilitant le testing et le changement d'implémentation.

**Exemple : `AnalyticsAdapter.ts`**

```typescript
/**
 * Analytics Adapter Interface
 * 
 * Defines the contract for analytics implementations
 */
export interface IAnalyticsAdapter {
  trackEvent(eventName: string, properties?: Record<string, unknown>): void;
  trackPageView(pageName: string): void;
  setUser(userId: string, traits?: Record<string, unknown>): void;
}

/**
 * Analytics Adapter Implementation
 * 
 * Concrete implementation using your analytics service
 * (e.g., Google Analytics, Mixpanel, Segment)
 */
export class AnalyticsAdapter implements IAnalyticsAdapter {
  private initialized = false;

  constructor(private config: { apiKey: string; enabled: boolean }) {
    if (config.enabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    // Initialize your analytics SDK here
    this.initialized = true;
  }

  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.config.enabled || !this.initialized) return;
    
    // Track event with your analytics service
    console.log('Analytics Event:', eventName, properties);
  }

  trackPageView(pageName: string): void {
    if (!this.config.enabled || !this.initialized) return;
    
    // Track page view
    console.log('Page View:', pageName);
  }

  setUser(userId: string, traits?: Record<string, unknown>): void {
    if (!this.config.enabled || !this.initialized) return;
    
    // Identify user
    console.log('User Identified:', userId, traits);
  }
}
```

**Mock pour les tests :**

```typescript
/**
 * Mock Analytics Adapter for testing
 */
export class MockAnalyticsAdapter implements IAnalyticsAdapter {
  public events: Array<{ name: string; properties?: Record<string, unknown> }> = [];
  public pageViews: string[] = [];
  public users: Array<{ userId: string; traits?: Record<string, unknown> }> = [];

  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    this.events.push({ name: eventName, properties });
  }

  trackPageView(pageName: string): void {
    this.pageViews.push(pageName);
  }

  setUser(userId: string, traits?: Record<string, unknown>): void {
    this.users.push({ userId, traits });
  }

  reset(): void {
    this.events = [];
    this.pageViews = [];
    this.users = [];
  }
}
```

### Couche 5 : Hooks de Données (TanStack Query)

Les hooks de données utilisent **TanStack Query** pour gérer le fetching, le caching et la synchronisation des données.

**Exemple : `useStudents.ts`**

```typescript
/**
 * useStudents Hook
 *
 * Fetches students from the API using TanStack Query
 * Handles loading, error states, and caching automatically
 */

import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

import { logApiError } from '@/lib/utils/client-error-logger';
import { handleAuthError } from '@/lib/utils/handle-auth-error';
import type { Student } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StudentsResponse {
  success: boolean;
  data: Student[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface UseStudentsReturn {
  students: Student[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch students from the API
 *
 * @param page - Page number for pagination (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 * @param filters - Optional filters (program, status, etc.)
 */
export function useStudents(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    programId?: string;
    status?: 'active' | 'completed' | 'suspended';
    search?: string;
  }
): UseStudentsReturn {
  const query = useQuery({
    queryKey: ['students', page, pageSize, filters],
    queryFn: async (): Promise<{ students: Student[]; totalCount: number }> => {
      // Build query string
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.programId && { programId: filters.programId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && { search: filters.search }),
      });

      const apiUrl = `${API_URL}/students?${params.toString()}`;

      try {
        const session = await getSession();
        const response = await fetch(apiUrl, {
          headers: {
            Accept: 'application/json',
            ...(session?.accessToken && {
              Authorization: `Bearer ${session.accessToken}`,
            }),
          },
        });

        if (handleAuthError(response)) {
          return { students: [], totalCount: 0 };
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.statusText}`);
        }

        const data = (await response.json()) as StudentsResponse;

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch students');
        }

        return {
          students: data.data || [],
          totalCount: data.pagination?.totalCount ?? data.data?.length ?? 0,
        };
      } catch (error: unknown) {
        logApiError('/students', 'GET', error, {
          page,
          pageSize,
          filters,
          category: 'students_fetch_error',
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    students: query.data?.students ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

## Composition des Composants

Maintenant, voyons comment **composer** ces couches dans un composant complet :

**Exemple : `StudentDetail.tsx`**

```typescript
/**
 * Student Detail Component
 * 
 * Combines ViewModel, presentation components, and data hooks
 */

'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { StudentHeader } from './shared/StudentHeader';
import { StudentInfoList } from './shared/StudentInfoList';
import { useStudentViewModel } from './hooks/useStudentViewModel';
import { useStudents } from '@/hooks/useStudents';

export function StudentDetail() {
  const params = useParams();
  const studentId = params.id as string;

  // Fetch student data
  const { students, isLoading } = useStudents(1, 1, {});
  const student = students.find((s) => s.id === studentId);

  // Transform data using ViewModel
  const viewModel = useStudentViewModel(student);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!viewModel) {
    return <div>Student not found</div>;
  }

  return (
    <div>
      <StudentHeader
        initials={viewModel.initials}
        fullName={viewModel.fullName}
        program={viewModel.raw.programName || 'Not assigned'}
        programStatus={viewModel.programStatus}
        onEdit={() => {
          // Handle edit
        }}
      />

      <StudentInfoList infoCards={viewModel.infoCards} />
    </div>
  );
}
```

## Utilitaires de Test

Pour faciliter les tests, créons des utilitaires réutilisables :

**Exemple : `test-utils.tsx`**

```typescript
/**
 * Test Utilities
 * 
 * Provides helpers for rendering components with required providers
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import * as React from 'react';

/**
 * Options for renderWithProviders
 */
export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom query client for testing
   */
  queryClient?: QueryClient;
}

/**
 * Renders a component wrapped with TanStack Query Provider
 * 
 * @example
 * ```tsx
 * const { getByText } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }), ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

**Test d'un composant :**

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { StudentHeader } from './StudentHeader';

describe('StudentHeader', () => {
  it('should display student name and status', () => {
    renderWithProviders(
      <StudentHeader
        initials="JD"
        fullName="John Doe"
        program="Web Development Bootcamp"
        programStatus={{ label: 'Active', color: 'info' }}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Web Development Bootcamp')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <StudentHeader
        initials="JD"
        fullName="John Doe"
        program="Web Development"
        programStatus={{ label: 'Active', color: 'info' }}
        onEdit={onEdit}
      />
    );

    const editButton = screen.getByLabelText('Edit student');
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
```

## Avantages de Cette Architecture

### 1. Testabilité Maximale

- **Services** : Fonctions pures, tests unitaires simples
- **ViewModels** : Logique isolée, facilement mockable
- **Composants** : Présentation pure, tests de rendu simples
- **Adapters** : Interfaces claires, mocks faciles

### 2. Maintenabilité

- **Séparation claire** des responsabilités
- **Organisation par domaine** facilite la navigation
- **Code réutilisable** à travers les services

### 3. Évolutivité

- **Ajout de nouvelles fonctionnalités** sans impacter l'existant
- **Changement d'implémentation** (ex: changer de bibliothèque UI) sans toucher à la logique métier
- **Scaling** facilité par la modularité

### 4. Onboarding

- **Structure claire** pour les nouveaux développeurs
- **Conventions** faciles à comprendre et suivre
- **Documentation** intégrée dans le code

## Pure Design System : Une Alternative Moderne

Pour ceux qui ne connaissent pas encore **Pure Design System**, c'est une approche intéressante basée sur les standards web. Le système utilise **Web Components** et la bibliothèque **Lit** pour créer des composants légers et réutilisables.

**Principes du PURE Manifesto :**
- Minimiser la surcharge (overhead)
- Utiliser les standards web natifs
- Limiter les dépendances
- Faire des choix pragmatiques

Cette approche s'intègre parfaitement dans notre architecture en couches, où les composants UI peuvent être remplacés sans impacter la logique métier. Vous pouvez consulter le [Storybook de Pure Design System](https://puredesignsystem.z6.web.core.windows.net/storybook) pour voir des exemples de composants.

## Conclusion

Cette architecture en couches offre un **équilibre entre structure et pragmatisme**. Elle permet de :

- ✅ **Tester facilement** chaque couche indépendamment
- ✅ **Maintenir** le code sur le long terme
- ✅ **Évoluer** sans casser l'existant
- ✅ **Onboarder** rapidement de nouveaux développeurs

L'organisation par domaine plutôt que par type technique rend le code plus **intuitif** et facilite la collaboration en équipe.

N'hésitez pas à adapter cette architecture à vos besoins spécifiques. L'important est de rester **cohérent** dans vos choix et de **documenter** vos décisions architecturales.

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/)
- [Pure Design System Storybook](https://puredesignsystem.z6.web.core.windows.net/#overview)
- [Testing Library](https://testing-library.com/)
