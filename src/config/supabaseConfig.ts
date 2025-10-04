import type ISupabaseRootConfig from 'src/common/interfaces/ISupabaseRootConfig';

export default (): ISupabaseRootConfig => {
  return {
    supabaseConfig: {
      supabaseSecret: process.env.SUPABASE_SECRET ?? '',
    },
  };
};
