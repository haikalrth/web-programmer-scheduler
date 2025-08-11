-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "All authenticated users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can only edit their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- RLS Policies for account_requests table
CREATE POLICY "Admin can view all requests"
ON public.account_requests FOR SELECT
TO authenticated
USING (get_user_role() = 'admin');

CREATE POLICY "Admin can update requests"
ON public.account_requests FOR UPDATE
TO authenticated
USING (get_user_role() = 'admin');

-- RLS Policies for tasks table
CREATE POLICY "Programmers can only see their assigned tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (auth.uid() = assigned_to);

CREATE POLICY "Managers and Admins can see all tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (get_user_role() IN ('manager', 'admin'));

CREATE POLICY "Programmers can only update status to review"
ON public.tasks FOR UPDATE
TO authenticated
USING (auth.uid() = assigned_to);

CREATE POLICY "Managers and Admins can update all fields"
ON public.tasks FOR UPDATE
TO authenticated
USING (get_user_role() IN ('manager', 'admin'));

CREATE POLICY "Only Managers and Admins can insert or delete tasks"
ON public.tasks FOR ALL
TO authenticated
USING (get_user_role() IN ('manager', 'admin'));

-- RLS Policies for teams and team_members tables
CREATE POLICY "Only Admins can perform all operations on teams"
ON public.teams FOR ALL
TO authenticated
USING (get_user_role() = 'admin');

CREATE POLICY "Only Admins can perform all operations on team_members"
ON public.team_members FOR ALL
TO authenticated
USING (get_user_role() = 'admin');

-- RLS Policies for calendar_events table
CREATE POLICY "All authenticated users can view all calendar events"
ON public.calendar_events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only Managers and Admins can insert, update, or delete calendar events"
ON public.calendar_events FOR ALL
TO authenticated
USING (get_user_role() IN ('admin', 'manager'));
