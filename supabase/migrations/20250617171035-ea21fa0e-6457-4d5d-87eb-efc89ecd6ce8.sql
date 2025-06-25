
-- Create enum types for better data validation
CREATE TYPE health_metric_type AS ENUM ('steps', 'weight', 'heart_rate', 'blood_pressure', 'water_intake', 'sleep');
CREATE TYPE blood_pressure_category AS ENUM ('normal', 'elevated', 'stage_1', 'stage_2');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table for storing all health metrics
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type health_metric_type NOT NULL,
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood_pressure_records table for more detailed BP tracking
CREATE TABLE public.blood_pressure_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  category blood_pressure_category,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_goals table for tracking daily/weekly goals
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type health_metric_type NOT NULL,
  target_value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  goal_type TEXT DEFAULT 'daily' CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, metric_type, goal_type)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_pressure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for health_records
CREATE POLICY "Users can view own health records" ON public.health_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records" ON public.health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records" ON public.health_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records" ON public.health_records
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blood_pressure_records
CREATE POLICY "Users can view own BP records" ON public.blood_pressure_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BP records" ON public.blood_pressure_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own BP records" ON public.blood_pressure_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own BP records" ON public.blood_pressure_records
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX idx_health_records_metric_type ON public.health_records(metric_type);
CREATE INDEX idx_health_records_recorded_at ON public.health_records(recorded_at);
CREATE INDEX idx_bp_records_user_id ON public.blood_pressure_records(user_id);
CREATE INDEX idx_bp_records_recorded_at ON public.blood_pressure_records(recorded_at);
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Create default goals for the new user
  INSERT INTO public.user_goals (user_id, metric_type, target_value, unit, goal_type) VALUES
    (NEW.id, 'steps', 10000, 'steps', 'daily'),
    (NEW.id, 'water_intake', 8, 'glasses', 'daily'),
    (NEW.id, 'sleep', 8, 'hours', 'daily');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update blood pressure category
CREATE OR REPLACE FUNCTION public.calculate_bp_category(systolic INTEGER, diastolic INTEGER)
RETURNS blood_pressure_category AS $$
BEGIN
  IF systolic < 120 AND diastolic < 80 THEN
    RETURN 'normal';
  ELSIF systolic BETWEEN 120 AND 129 AND diastolic < 80 THEN
    RETURN 'elevated';
  ELSIF (systolic BETWEEN 130 AND 139) OR (diastolic BETWEEN 80 AND 89) THEN
    RETURN 'stage_1';
  ELSE
    RETURN 'stage_2';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set BP category
CREATE OR REPLACE FUNCTION public.set_bp_category()
RETURNS TRIGGER AS $$
BEGIN
  NEW.category = public.calculate_bp_category(NEW.systolic, NEW.diastolic);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bp_category_trigger
  BEFORE INSERT OR UPDATE ON public.blood_pressure_records
  FOR EACH ROW EXECUTE FUNCTION public.set_bp_category();

-- Enable realtime for all tables
ALTER TABLE public.health_records REPLICA IDENTITY FULL;
ALTER TABLE public.blood_pressure_records REPLICA IDENTITY FULL;
ALTER TABLE public.user_goals REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_pressure_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
