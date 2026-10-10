import { supabase } from "../config/supabaseClient.js";
import { HttpError, pick } from "../utils/httpError.js";

export function createCrudModel({ table, fields, required, label }) {
  return {
    async getAll() {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new HttpError(404, `${label} tidak ditemukan`);
      return data;
    },

    async create(body) {
      const payload = pick(body, fields);
      for (const f of required) {
        if (!payload[f]) throw new HttpError(400, `${f} wajib diisi`);
      }
      const { data, error } = await supabase.from(table).insert([payload]).select();
      if (error) throw error;
      return data[0];
    },

    async update(id, body) {
      const payload = pick(body, fields);
      if (Object.keys(payload).length === 0) {
        throw new HttpError(400, "Tidak ada field yang diupdate");
      }
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", id)
        .select();
      if (error) throw error;
      if (data.length === 0) throw new HttpError(404, `${label} tidak ditemukan`);
      return data[0];
    },

    async remove(id) {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .select("id");
      if (error) throw error;
      if (data.length === 0) throw new HttpError(404, `${label} tidak ditemukan`);
      return { message: `${label} berhasil dihapus` };
    },
  };
}
