export default interface ISupabasePayload {
  metadata: {
    uuid: string;
    time: string;
    name: string;
    ip_address: string;
  };
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    phone: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: Record<string, any>;
    identities: Array<Record<string, any>>;
    created_at: string | null;
    updated_at: string | null;
    is_anonymous: boolean;
  };
}
