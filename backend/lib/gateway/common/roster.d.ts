export interface Roster {
    role: 'members' | 'readers' | 'writers' | 'owners' | string;
    id: string;
    up: {
        paths: string[];
        indirect: Record<string, boolean>;
    };
    down: {
        direct: Record<string, boolean>;
        indirect: Record<string, boolean>;
    };
}
//# sourceMappingURL=roster.d.ts.map