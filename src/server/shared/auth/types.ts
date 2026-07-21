export type SessionUser = {
  uuid: string;
  email: string;
  fullName: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type SessionOrganization = {
  uuid: string;
  legalName: string;
  tradeName: string | null;
  slug: string;
  planTier: string;
  status: string;
  displayName: string;
};

export type SessionMembership = {
  roleCode: string;
  roleName: string;
  permissions: string[];
};

export type AuthContext = {
  user: SessionUser;
  organization: SessionOrganization | null;
  membership: SessionMembership | null;
  organizations: Array<{
    uuid: string;
    legalName: string;
    tradeName: string | null;
    slug: string;
    planTier: string;
    status: string;
    role: { code: string; name: string };
  }>;
};

export type ResolvedSession = AuthContext & {
  userId: bigint;
  organizationId: bigint | null;
};
