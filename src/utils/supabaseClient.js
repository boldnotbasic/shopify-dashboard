import { createClient } from '@supabase/supabase-js';

// Supabase configuratie
// Deze keys zijn publiek (ANON key) en veilig om te delen
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions voor database operaties
export const db = {
  // Apps
  apps: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    create: async (app) => {
      const { data, error } = await supabase
        .from('apps')
        .insert(app)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('apps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Themes
  themes: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    create: async (theme) => {
      const { data, error } = await supabase
        .from('themes')
        .insert(theme)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('themes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Projects
  projects: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (project) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Branding Resources
  brandingResources: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('branding_resources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (resource) => {
      const { data, error } = await supabase
        .from('branding_resources')
        .insert(resource)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('branding_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('branding_resources')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Sales/Quotes
  sales: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (sale) => {
      const { data, error } = await supabase
        .from('sales')
        .insert(sale)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // FAQs
  faqs: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (faq) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  }
  ,
  // Upsells
  upsells: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('upsells')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (upsell) => {
      const { data, error } = await supabase
        .from('upsells')
        .insert(upsell)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('upsells')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('upsells')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  }
};

// File storage helper
export const storage = {
  // Upload file naar Supabase Storage
  upload: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    if (error) throw error;
    return data;
  },

  // Get public URL voor file
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file
  delete: async (bucket, paths) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(Array.isArray(paths) ? paths : [paths]);
    if (error) throw error;
  }
};

// Real-time subscriptions
export const subscribe = {
  // Subscribe to table changes
  toTable: (table, callback) => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }
};

export default supabase;
