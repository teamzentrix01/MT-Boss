export const FRANCHISE_PERMISSION_DEFINITIONS = [
  {
    key: 'projects.view',
    group: 'Projects',
    label: 'View Projects',
    description: 'View projects belonging to this franchise.',
  },
  {
    key: 'projects.create',
    group: 'Projects',
    label: 'Create Projects',
    description: 'Create new projects for the franchise territory.',
  },
  {
    key: 'projects.edit',
    group: 'Projects',
    label: 'Edit Projects',
    description: 'Edit project, client, stage, and publishing details.',
  },
  {
    key: 'projects.delete',
    group: 'Projects',
    label: 'Delete Projects',
    description: 'Permanently delete projects belonging to this franchise.',
  },
  {
    key: 'financials.view',
    group: 'Projects',
    label: 'View Financials',
    description: 'View deal values, received amounts, costs, commissions, and profit/loss.',
  },
  {
    key: 'leads.view',
    group: 'Leads',
    label: 'View Assigned Leads',
    description: 'View leads assigned by an administrator to this franchise.',
  },
  {
    key: 'leads.manage',
    group: 'Leads',
    label: 'Manage Assigned Leads',
    description: 'Update lead status, stage, follow-up date, and notes.',
  },
  {
    key: 'agents.view',
    group: 'Agents',
    label: 'View Approved Agents',
    description: 'View approved agents available in the franchise city.',
  },
  {
    key: 'agents.assign',
    group: 'Agents',
    label: 'Assign Agents',
    description: 'Assign or remove approved agents on projects and leads.',
  },
  {
    key: 'slots.manage',
    group: 'Quick Services',
    label: 'Manage Service Slots',
    description: 'Create, edit, open, close, and delete slots in the franchise city.',
  },
];

export const FRANCHISE_PERMISSION_KEYS = FRANCHISE_PERMISSION_DEFINITIONS.map(({ key }) => key);

export const LEGACY_FRANCHISE_PERMISSIONS = Object.freeze(
  Object.fromEntries(FRANCHISE_PERMISSION_KEYS.map((key) => [key, true]))
);

export const EMPTY_FRANCHISE_PERMISSIONS = Object.freeze(
  Object.fromEntries(FRANCHISE_PERMISSION_KEYS.map((key) => [key, false]))
);

export function normalizeFranchisePermissions(value, fallback = EMPTY_FRANCHISE_PERMISSIONS) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  return Object.fromEntries(
    FRANCHISE_PERMISSION_KEYS.map((key) => [key, source[key] === true])
  );
}

export function resolveFranchisePermissionDependencies(value) {
  const permissions = normalizeFranchisePermissions(value);

  if (permissions['projects.create'] || permissions['projects.edit'] || permissions['projects.delete']) {
    permissions['projects.view'] = true;
  }
  if (permissions['leads.manage']) {
    permissions['leads.view'] = true;
  }
  if (permissions['agents.assign']) {
    permissions['agents.view'] = true;
  }

  return permissions;
}

export function hasFranchisePermission(permissions, permission) {
  return normalizeFranchisePermissions(permissions)[permission] === true;
}
