import { supabase } from "../config/supabaseClient.js";
import { HttpError, pick } from "../utils/httpError.js";
import { today, addDays, isValidDate } from "../utils/date.js";

export const VALID_STATUS = ["Dipinjam", "Dikembalikan", "Terlambat"];
const DEFAULT_LOAN_DAYS = 7;

const SELECT = `
  id, loan_date, due_date, return_date, status, notes, created_at,
  members ( id, name, email ),
  books ( id, title, author )
`;

async function markOverdue() {
  const { error } = await supabase
    .from("loans")
    .update({ status: "Terlambat" })
    .eq("status", "Dipinjam")
    .lt("due_date", today());
  if (error) throw error;
}

function validate(payload) {
  if (payload.status !== undefined && !VALID_STATUS.includes(payload.status)) {
    throw new HttpError(400, `status harus salah satu dari: ${VALID_STATUS.join(", ")}`);
  }
  for (const f of ["loan_date", "due_date", "return_date"]) {
    if (payload[f] !== undefined && payload[f] !== null && !isValidDate(payload[f])) {
      throw new HttpError(400, `${f} harus berformat YYYY-MM-DD`);
    }
  }
}

export const LoanModel = {
  async getAll(filters = {}) {
    if (filters.status && !VALID_STATUS.includes(filters.status)) {
      throw new HttpError(400, `status harus salah satu dari: ${VALID_STATUS.join(", ")}`);
    }

    await markOverdue();

    let query = supabase
      .from("loans")
      .select(SELECT)
      .order("created_at", { ascending: false });

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.member_id) query = query.eq("member_id", filters.member_id);
    if (filters.book_id) query = query.eq("book_id", filters.book_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    await markOverdue();
    const { data, error } = await supabase
      .from("loans")
      .select(SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError(404, "Data peminjaman tidak ditemukan");
    return data;
  },

  async create(body) {
    const payload = pick(body, ["member_id", "book_id", "loan_date", "due_date", "notes"]);

    if (!payload.member_id || !payload.book_id) {
      throw new HttpError(400, "member_id dan book_id wajib diisi");
    }

    payload.loan_date = payload.loan_date ?? today();
    validate(payload);
    payload.due_date = payload.due_date ?? addDays(payload.loan_date, DEFAULT_LOAN_DAYS);

    if (payload.due_date < payload.loan_date) {
      throw new HttpError(400, "due_date tidak boleh sebelum loan_date");
    }

    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select(SELECT);
    if (error) throw error;
    return data[0];
  },

  async update(id, body) {
    const payload = pick(body, [
      "member_id", "book_id", "loan_date", "due_date", "return_date", "status", "notes",
    ]);

    if (Object.keys(payload).length === 0) {
      throw new HttpError(400, "Tidak ada field yang diupdate");
    }
    validate(payload);

    if (payload.status === "Dikembalikan" && !payload.return_date) {
      payload.return_date = today();
    }

    if (payload.return_date && !payload.status) {
      payload.status = "Dikembalikan";
    }

    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select(SELECT);
    if (error) throw error;
    if (data.length === 0) throw new HttpError(404, "Data peminjaman tidak ditemukan");
    return data[0];
  },

  async remove(id) {
    const { data, error } = await supabase
      .from("loans")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw error;
    if (data.length === 0) throw new HttpError(404, "Data peminjaman tidak ditemukan");
    return { message: "Peminjaman berhasil dihapus" };
  },
};
