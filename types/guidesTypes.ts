// Guides Types

export interface Stage {
    id: string;
    name: string;
    description: string;
    minMonths: number;
    maxMonths: number;
    icon: string;
    color: string;
}

export interface GuideModule {
    id: string;
    stageId: string;
    order: number;
    title: string;
    description: string;
    icon: string;
    isPriority: boolean; // "Recomendado Leer Pronto" badge
    content: ModuleContent;
}

export interface ModuleContent {
    intro: string;
    sections: ContentSection[];
    checklist?: ChecklistItem[];
    tips?: string[];
    warningSignals?: string[];
}

export interface ContentSection {
    title: string;
    content: string;
    image?: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    category?: string;
}

export interface UserGuideProgress {
    stageId: string;
    completedModules: string[];
    favoriteModules: string[];
    checklistStates: Record<string, Record<string, boolean>>; // moduleId -> checklistId -> completed
    lastUpdated: string;
}

export interface GuideWithChildren {
    stage: Stage;
    modules: GuideModule[];
    applicableChildren: {
        id: string;
        name: string;
        ageMonths: number;
    }[];
    progress: {
        completed: number;
        total: number;
        percentage: number;
    };
}

// Stage definitions
export const STAGES: Stage[] = [
    {
        id: 'newborn',
        name: 'Recién Nacido',
        description: 'Los primeros 3 meses de vida',
        minMonths: 0,
        maxMonths: 3,
        icon: 'child_friendly',
        color: '#FF6B9D'
    },
    {
        id: 'infant-early',
        name: 'Bebé Pequeño',
        description: 'De 3 a 6 meses',
        minMonths: 3,
        maxMonths: 6,
        icon: 'child_care',
        color: '#FF8A65'
    },
    {
        id: 'infant-mid',
        name: 'Bebé Medio',
        description: 'De 6 a 9 meses',
        minMonths: 6,
        maxMonths: 9,
        icon: 'emoji_people',
        color: '#FFB74D'
    },
    {
        id: 'infant-late',
        name: 'Bebé Mayor',
        description: 'De 9 a 12 meses',
        minMonths: 9,
        maxMonths: 12,
        icon: 'directions_walk',
        color: '#FFD54F'
    },
    {
        id: 'toddler-early',
        name: 'Toddler Temprano',
        description: 'De 1 a 2 años',
        minMonths: 12,
        maxMonths: 24,
        icon: 'directions_run',
        color: '#AED581'
    },
    {
        id: 'toddler-late',
        name: 'Toddler Tardío',
        description: 'De 2 a 3 años',
        minMonths: 24,
        maxMonths: 36,
        icon: 'sports_handball',
        color: '#4FC3F7'
    },
    {
        id: 'preschool',
        name: 'Preescolar',
        description: 'De 3 a 5 años',
        minMonths: 36,
        maxMonths: 60,
        icon: 'school',
        color: '#7986CB'
    },
    {
        id: 'early-school',
        name: 'Escolar Temprano',
        description: 'De 5 a 7 años',
        minMonths: 60,
        maxMonths: 84,
        icon: 'backpack',
        color: '#9575CD'
    }
];
