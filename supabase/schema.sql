-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap TEXT,
  npm TEXT,
  jurusan TEXT,
  email TEXT, -- Denormalized for easier querying
  role TEXT NOT NULL CHECK (role IN ('programmer', 'manager', 'admin')) DEFAULT 'programmer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- account_requests table
CREATE TABLE account_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nama_lengkap TEXT NOT NULL,
  npm TEXT NOT NULL,
  jurusan TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW()
);

-- tasks table
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  sub_tasks JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'review', 'revision', 'completed')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  tenggat_waktu DATE,
  pull_request_url TEXT,
  catatan_revisi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- teams table
CREATE TABLE teams (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nama_tim TEXT NOT NULL,
  deskripsi TEXT,
  created_by UUID REFERENCES profiles(id), -- Must be an admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- team_members table
CREATE TABLE team_members (
  team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

-- calendar_events table
CREATE TABLE calendar_events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_mulai TIMESTAMPTZ NOT NULL,
  tanggal_selesai TIMESTAMPTZ,
  tipe_acara TEXT NOT NULL CHECK (tipe_acara IN ('meeting', 'deadline', 'announcement')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
