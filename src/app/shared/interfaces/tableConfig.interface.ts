interface ButtonsConfig {
    baseRouterLink?: string;
    validateButton?: boolean;
    validateButtonMessage?: string;
    metricsButton?: boolean;
    viewButton?: boolean;
    editButton?: boolean;
    newButton?: boolean;
    deleteButton?: boolean;
    deleteButtonMessage?: string;
    deleteUserButton?: boolean;
    deleteUserButtonMessage?: string;
    deleteChallengeSuscriptionButton?: boolean;
    deleteChallengeSuscriptionButtonMessage?: string;
}
interface FilterConfig {
    exists: boolean;
    type: 'INPUT' | 'DATE' | 'DROPDOWN';
    placeholder?: string;
    formControl: {
        name: string;
    };
    dropdownConfig?: DropdownConfig;
    sortFilterExists: boolean;

}

interface DropdownConfig {
    items: any[];
    label: string;
    value: string;
}

interface ColumnsConfig {
    columnDef: string;
    columnValue: string;
    columnBaseLink?: any;
    columnLinkId?: string;
    headerLabel: string;
    columnType: 'STRING' | 'DATE' | 'IMG' | 'LINK' | 'CHECKBOX' | 'RATING';
    filter: FilterConfig;
}

export interface TableConfig {
    displayedColumns?: string[];
    filterColumnEnabled: boolean;
    paginatorExists: boolean;
    columns?: ColumnsConfig[];
    buttonsConfig?: ButtonsConfig;
}
