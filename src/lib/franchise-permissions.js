export const FRANCHISE_PERMISSION_DEFINITIONS = [
  { key: 'profile.change_password', group: 'Account', label: 'Change Password', description: 'Change the franchise login password.' },
  { key: 'dashboard.view_statistics', group: 'Dashboard', label: 'View Dashboard Statistics', description: 'View project, publishing, draft and assigned-lead totals.' },

  { key: 'projects.view', group: 'Projects', label: 'View Projects', description: 'View projects belonging to this franchise.' },
  { key: 'projects.view_client_details', group: 'Projects', label: 'View Project Client Details', description: 'View client name, phone and email on projects.' },
  { key: 'projects.view_notes', group: 'Projects', label: 'View Project Notes', description: 'View internal notes recorded against projects.' },
  { key: 'projects.view_assigned_agent', group: 'Projects', label: 'View Assigned Project Agent', description: 'View which agent is assigned to each project.' },
  { key: 'projects.create', group: 'Projects', label: 'Create Projects', description: 'Create new projects in the franchise territory.' },
  { key: 'projects.edit', group: 'Projects', label: 'Edit Project Details', description: 'Edit title, category, description and size.' },
  { key: 'projects.delete', group: 'Projects', label: 'Delete Projects', description: 'Permanently delete franchise projects.' },
  { key: 'projects.publish', group: 'Projects', label: 'Publish / Unpublish Projects', description: 'Change a project between draft and published.' },
  { key: 'projects.manage_stage', group: 'Projects', label: 'Manage Project Stage', description: 'Update operational project stages.' },
  { key: 'projects.manage_clients', group: 'Projects', label: 'Manage Project Clients', description: 'Add or edit client name, phone and email.' },
  { key: 'projects.manage_notes', group: 'Projects', label: 'Manage Project Notes', description: 'Add or edit internal project notes.' },
  { key: 'projects.manage_images', group: 'Projects', label: 'Manage Project Images', description: 'Upload or replace project images.' },

  { key: 'financials.view', group: 'Financials', label: 'View Financials', description: 'View deal value, payments, costs, commissions and profit/loss.' },
  { key: 'financials.view_deal', group: 'Financials', label: 'View Deal Amount', description: 'View project deal values.' },
  { key: 'financials.view_payments', group: 'Financials', label: 'View Received Payments', description: 'View received totals and payment counts.' },
  { key: 'financials.view_costs', group: 'Financials', label: 'View Project Costs', description: 'View labour, material, transport and extra expenses.' },
  { key: 'financials.view_commission', group: 'Financials', label: 'View Agent Commission', description: 'View calculated agent commissions.' },
  { key: 'financials.view_profit_loss', group: 'Financials', label: 'View Profit / Loss', description: 'View calculated project profit or loss.' },
  { key: 'financials.edit_deal', group: 'Financials', label: 'Edit Deal Amount', description: 'Set or update a project deal amount.' },

  { key: 'leads.view', group: 'Leads', label: 'View Assigned Leads', description: 'View leads assigned to this franchise.' },
  { key: 'leads.view_contact_details', group: 'Leads', label: 'View Lead Contact Details', description: 'View lead phone numbers and email addresses.' },
  { key: 'leads.view_service_details', group: 'Leads', label: 'View Lead Service Details', description: 'View requested service and city.' },
  { key: 'leads.view_source', group: 'Leads', label: 'View Lead Source', description: 'View where each lead originated.' },
  { key: 'leads.view_notes', group: 'Leads', label: 'View Lead Notes', description: 'View notes recorded against assigned leads.' },
  { key: 'leads.view_assigned_agent', group: 'Leads', label: 'View Assigned Lead Agent', description: 'View which agent is assigned to each lead.' },
  { key: 'leads.manage', group: 'Leads', label: 'Manage All Lead Fields', description: 'Master permission for every lead-management action.' },
  { key: 'leads.update_status', group: 'Leads', label: 'Update Lead Status', description: 'Change New, Contacted, Follow-up, Converted or Lost status.' },
  { key: 'leads.update_stage', group: 'Leads', label: 'Update Lead Stage', description: 'Move leads through operational stages.' },
  { key: 'leads.update_follow_up', group: 'Leads', label: 'Update Follow-up Date', description: 'Schedule or change lead follow-up dates.' },
  { key: 'leads.edit_notes', group: 'Leads', label: 'Edit Lead Notes', description: 'Add or update notes on assigned leads.' },
  { key: 'leads.convert', group: 'Leads', label: 'Convert Leads to Projects', description: 'Finalize a lead and create its operational project.' },

  { key: 'agents.view', group: 'Agents', label: 'View Approved Agents', description: 'View approved agents in the franchise city.' },
  { key: 'agents.view_contact_details', group: 'Agents', label: 'View Agent Contact Details', description: 'View approved agent phone numbers and email addresses.' },
  { key: 'agents.assign', group: 'Agents', label: 'Assign Agents Everywhere', description: 'Master permission to assign agents to projects and leads.' },
  { key: 'agents.assign_projects', group: 'Agents', label: 'Assign Agents to Projects', description: 'Assign or remove an agent on a franchise project.' },
  { key: 'agents.assign_leads', group: 'Agents', label: 'Assign Agents to Leads', description: 'Assign or remove an agent on an assigned lead.' },

  { key: 'slots.view', group: 'Quick-Service Slots', label: 'View Service Slots', description: 'View free and paid slots for the franchise city.' },
  { key: 'slots.manage', group: 'Quick-Service Slots', label: 'Manage All Service Slots', description: 'Master permission for all free and paid slot actions.' },
  { key: 'slots.free.create', group: 'Quick-Service Slots', label: 'Create Free Slots', description: 'Create free quick-service slots.' },
  { key: 'slots.free.edit', group: 'Quick-Service Slots', label: 'Edit / Open / Close Free Slots', description: 'Edit free slot details and availability.' },
  { key: 'slots.free.delete', group: 'Quick-Service Slots', label: 'Delete Free Slots', description: 'Delete free slots without bookings.' },
  { key: 'slots.paid.create', group: 'Quick-Service Slots', label: 'Create Paid Slot Rules', description: 'Create paid slot availability records.' },
  { key: 'slots.paid.edit', group: 'Quick-Service Slots', label: 'Edit / Open / Close Paid Slots', description: 'Update paid slot availability records.' },

  { key: 'construction_services.view', group: 'Construction Services', label: 'View Construction Services', description: 'View construction services created by this franchise.' },
  { key: 'construction_services.create', group: 'Construction Services', label: 'Create Construction Services', description: 'Create new construction service listings.' },
  { key: 'construction_services.edit', group: 'Construction Services', label: 'Edit Construction Services', description: 'Edit franchise-created construction services.' },
  { key: 'construction_services.delete', group: 'Construction Services', label: 'Delete Construction Services', description: 'Delete franchise-created construction services.' },
  { key: 'construction_services.upload_images', group: 'Construction Services', label: 'Upload Construction Images', description: 'Upload or replace construction service images.' },

  { key: 'quick_services.view', group: 'Quick Services', label: 'View Quick Services', description: 'View quick services created by this franchise.' },
  { key: 'quick_services.create', group: 'Quick Services', label: 'Create Quick Services', description: 'Create quick services for the franchise city.' },
  { key: 'quick_services.edit', group: 'Quick Services', label: 'Edit Quick Services', description: 'Edit franchise-created quick services.' },
  { key: 'quick_services.delete', group: 'Quick Services', label: 'Delete Quick Services', description: 'Delete franchise-created quick services.' },
  { key: 'quick_services.upload_images', group: 'Quick Services', label: 'Upload Quick-Service Images', description: 'Upload or replace quick-service images and icons.' },
  { key: 'quick_services.manage_pricing', group: 'Quick Services', label: 'Manage Quick-Service Pricing', description: 'Change base and visiting prices.' },
  { key: 'quick_services.manage_status', group: 'Quick Services', label: 'Activate / Deactivate Quick Services', description: 'Control whether franchise quick services are active.' },

  { key: 'vendors.view', group: 'Vendors', label: 'View Vendors', description: 'View vendors operating in the franchise city.' },
  { key: 'vendors.create', group: 'Vendors', label: 'Create Vendors', description: 'Create vendor accounts in the franchise city.' },
  { key: 'vendors.edit', group: 'Vendors', label: 'Edit Vendors', description: 'Edit vendor business and contact details.' },
  { key: 'vendors.approve', group: 'Vendors', label: 'Approve Vendors', description: 'Approve pending vendors in the franchise city.' },
  { key: 'vendors.reject', group: 'Vendors', label: 'Reject Vendors', description: 'Reject vendor applications.' },
  { key: 'vendors.manage_status', group: 'Vendors', label: 'Activate / Deactivate Vendors', description: 'Control whether vendors can receive work.' },
  { key: 'vendors.manage_services', group: 'Vendors', label: 'Manage Vendor Services', description: 'Assign quick services to vendors.' },
  { key: 'vendors.delete', group: 'Vendors', label: 'Delete Vendors', description: 'Delete vendor accounts created by this franchise.' },

  { key: 'agents.create', group: 'Agents', label: 'Create Agents', description: 'Create agents in the franchise city.' },
  { key: 'agents.manage_directory', group: 'Agents', label: 'View Agent Management', description: 'View pending, approved and rejected agents in the franchise city.' },
  { key: 'agents.edit', group: 'Agents', label: 'Edit Agents', description: 'Edit agent profile and contact information.' },
  { key: 'agents.manage_status', group: 'Agents', label: 'Manage Agent Status', description: 'Move agents through Pending, Reviewing and Rejected states.' },
  { key: 'agents.approve', group: 'Agents', label: 'Approve Agents / Create Login', description: 'Approve agents and generate their login credentials.' },
  { key: 'agents.reset_password', group: 'Agents', label: 'Reset Agent Password', description: 'Generate a new temporary password for approved agents.' },
  { key: 'agents.delete', group: 'Agents', label: 'Delete Agents', description: 'Delete agents created by this franchise when they have no linked work.' },
];

export const FRANCHISE_PERMISSION_KEYS = FRANCHISE_PERMISSION_DEFINITIONS.map(({ key }) => key);

export const LEGACY_FRANCHISE_PERMISSIONS = Object.freeze(
  Object.fromEntries(FRANCHISE_PERMISSION_KEYS.map((key) => [key, true]))
);

export const EMPTY_FRANCHISE_PERMISSIONS = Object.freeze(
  Object.fromEntries(FRANCHISE_PERMISSION_KEYS.map((key) => [key, false]))
);

export const DEFAULT_APPROVED_FRANCHISE_PERMISSIONS = Object.freeze({
  'profile.change_password': true,
  'dashboard.view_statistics': true,
  'projects.view': true,
  'projects.view_client_details': true,
  'projects.view_notes': true,
  'projects.view_assigned_agent': true,
  'projects.create': true,
  'projects.edit': true,
  'projects.manage_stage': true,
  'projects.manage_clients': true,
  'projects.manage_notes': true,
  'projects.manage_images': true,
  'leads.view': true,
  'leads.view_contact_details': true,
  'leads.view_service_details': true,
  'leads.view_source': true,
  'leads.view_notes': true,
  'leads.view_assigned_agent': true,
  'leads.update_status': true,
  'leads.update_stage': true,
  'leads.update_follow_up': true,
  'leads.edit_notes': true,
  'leads.convert': true,
  'agents.view': true,
  'agents.view_contact_details': true,
  'agents.assign_leads': true,
  'agents.assign_projects': true,
  'slots.view': true,
  'slots.free.create': true,
  'slots.free.edit': true,
  'slots.paid.create': true,
  'slots.paid.edit': true,
  'vendors.view': true,
});

const LEGACY_EXPANSIONS = {
  'projects.view': ['dashboard.view_statistics', 'projects.view_client_details', 'projects.view_notes', 'projects.view_assigned_agent'],
  'projects.edit': [
    'projects.publish', 'projects.manage_stage', 'projects.manage_clients',
    'projects.manage_notes', 'projects.manage_images',
  ],
  'financials.view': [
    'financials.view_deal', 'financials.view_payments', 'financials.view_costs',
    'financials.view_commission', 'financials.view_profit_loss', 'financials.edit_deal',
  ],
  'leads.view': [
    'dashboard.view_statistics', 'leads.view_contact_details', 'leads.view_service_details',
    'leads.view_source', 'leads.view_notes', 'leads.view_assigned_agent',
  ],
  'leads.manage': [
    'leads.update_status', 'leads.update_stage', 'leads.update_follow_up',
    'leads.edit_notes', 'leads.convert',
  ],
  'agents.assign': ['agents.assign_projects', 'agents.assign_leads'],
  'agents.view': ['agents.view_contact_details'],
  'slots.manage': [
    'slots.view', 'slots.free.create', 'slots.free.edit', 'slots.free.delete',
    'slots.paid.create', 'slots.paid.edit',
  ],
};

export function normalizeFranchisePermissions(value, fallback = EMPTY_FRANCHISE_PERMISSIONS) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  const permissions = Object.fromEntries(
    FRANCHISE_PERMISSION_KEYS.map((key) => [key, source[key] === true])
  );

  // Existing franchise records used broad permissions. Preserve their access
  // when the new action-level keys have not yet been saved.
  for (const [legacyKey, expandedKeys] of Object.entries(LEGACY_EXPANSIONS)) {
    if (source[legacyKey] !== true) continue;
    for (const key of expandedKeys) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) permissions[key] = true;
    }
  }
  const hasOldPermissions = ['projects.view', 'leads.view', 'agents.view', 'slots.manage']
    .some((key) => source[key] === true);
  if (hasOldPermissions) {
    if (!Object.prototype.hasOwnProperty.call(source, 'profile.change_password')) permissions['profile.change_password'] = true;
  }
  return permissions;
}

export function resolveFranchisePermissionDependencies(value) {
  const permissions = normalizeFranchisePermissions(value);
  const any = (keys) => keys.some((key) => permissions[key]);
  const grant = (keys) => keys.forEach((key) => { permissions[key] = true; });

  if (permissions['leads.manage']) grant(LEGACY_EXPANSIONS['leads.manage']);
  if (permissions['agents.assign']) grant(LEGACY_EXPANSIONS['agents.assign']);
  if (permissions['slots.manage']) grant(LEGACY_EXPANSIONS['slots.manage']);
  if (permissions['financials.view']) {
    grant([
      'financials.view_deal', 'financials.view_payments', 'financials.view_costs',
      'financials.view_commission', 'financials.view_profit_loss',
    ]);
  }

  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('projects.') && key !== 'projects.view'))) {
    permissions['projects.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('leads.') && key !== 'leads.view'))) {
    permissions['leads.view'] = true;
  }
  if (permissions['agents.assign'] || permissions['agents.assign_projects'] || permissions['agents.assign_leads']) {
    permissions['agents.view'] = true;
  }
  if (permissions['agents.assign_projects']) permissions['projects.view'] = true;
  if (permissions['agents.assign_leads']) permissions['leads.view'] = true;
  if (permissions['projects.manage_clients']) permissions['projects.view_client_details'] = true;
  if (permissions['projects.manage_notes']) permissions['projects.view_notes'] = true;
  if (permissions['agents.assign_projects']) permissions['projects.view_assigned_agent'] = true;
  if (permissions['agents.assign_leads']) permissions['leads.view_assigned_agent'] = true;
  if (permissions['leads.edit_notes']) permissions['leads.view_notes'] = true;
  if (permissions['agents.view_contact_details']) permissions['agents.view'] = true;
  if (any(['agents.create', 'agents.edit', 'agents.manage_status', 'agents.approve', 'agents.reset_password', 'agents.delete'])) {
    permissions['agents.manage_directory'] = true;
  }
  if (permissions['construction_services.create']) permissions['construction_services.upload_images'] = true;
  if (permissions['quick_services.create']) permissions['quick_services.upload_images'] = true;
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('construction_services.') && key !== 'construction_services.view'))) {
    permissions['construction_services.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('quick_services.') && key !== 'quick_services.view'))) {
    permissions['quick_services.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('vendors.') && key !== 'vendors.view'))) {
    permissions['vendors.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('agents.') && key !== 'agents.view' && key !== 'agents.view_contact_details'))) {
    permissions['agents.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('slots.') && key !== 'slots.view'))) {
    permissions['slots.view'] = true;
  }
  if (permissions['financials.edit_deal']) {
    permissions['financials.view_deal'] = true;
    permissions['projects.view'] = true;
  }
  if (any(FRANCHISE_PERMISSION_KEYS.filter((key) => key.startsWith('financials.view_')))) {
    permissions['projects.view'] = true;
  }
  return permissions;
}

export function hasFranchisePermission(permissions, permission) {
  return normalizeFranchisePermissions(permissions)[permission] === true;
}
