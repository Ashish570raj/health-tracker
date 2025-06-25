
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type HealthMetricType = 'steps' | 'weight' | 'heart_rate' | 'water_intake' | 'sleep';

interface HealthRecord {
  id: string;
  metric_type: HealthMetricType;
  value: number;
  unit: string;
  notes?: string;
  recorded_at: string;
}

interface BloodPressureRecord {
  id: string;
  systolic: number;
  diastolic: number;
  category: string;
  notes?: string;
  recorded_at: string;
}

interface UserGoal {
  id: string;
  metric_type: HealthMetricType;
  target_value: number;
  unit: string;
  goal_type: string;
  is_active: boolean;
}

export const useHealthData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch health records
  const { data: healthRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch blood pressure records
  const { data: bpRecords = [], isLoading: bpLoading } = useQuery({
    queryKey: ['bloodPressureRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blood_pressure_records')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user goals
  const { data: userGoals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['userGoals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add health record mutation
  const addHealthRecord = useMutation({
    mutationFn: async ({ metric_type, value, unit, notes }: Omit<HealthRecord, 'id' | 'recorded_at'>) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          user_id: user?.id,
          metric_type,
          value,
          unit,
          notes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
      toast.success('Health record added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add health record');
    },
  });

  // Add blood pressure record mutation
  const addBPRecord = useMutation({
    mutationFn: async ({ systolic, diastolic, notes }: Omit<BloodPressureRecord, 'id' | 'recorded_at' | 'category'>) => {
      const { data, error } = await supabase
        .from('blood_pressure_records')
        .insert({
          user_id: user?.id,
          systolic,
          diastolic,
          notes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bloodPressureRecords'] });
      toast.success('Blood pressure logged successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to log blood pressure');
    },
  });

  // Update user goal mutation
  const updateGoal = useMutation({
    mutationFn: async ({ metric_type, target_value }: { metric_type: HealthMetricType; target_value: number }) => {
      const { data, error } = await supabase
        .from('user_goals')
        .upsert({
          user_id: user?.id,
          metric_type,
          target_value,
          unit: getUnitForMetric(metric_type),
          goal_type: 'daily',
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      toast.success('Goal updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update goal');
    },
  });

  // Helper functions
  const getRecordsByType = (type: HealthMetricType) => {
    return healthRecords.filter(record => record.metric_type === type);
  };

  const getLatestRecord = (type: HealthMetricType) => {
    const records = getRecordsByType(type);
    return records[0] || null;
  };

  const getGoalForMetric = (type: HealthMetricType) => {
    return userGoals.find(goal => goal.metric_type === type);
  };

  const getUnitForMetric = (type: HealthMetricType): string => {
    switch (type) {
      case 'steps': return 'steps';
      case 'weight': return 'kg';
      case 'heart_rate': return 'bpm';
      case 'water_intake': return 'glasses';
      case 'sleep': return 'hours';
      default: return '';
    }
  };

  return {
    healthRecords,
    bpRecords,
    userGoals,
    loading: recordsLoading || bpLoading || goalsLoading,
    addHealthRecord,
    addBPRecord,
    updateGoal,
    getRecordsByType,
    getLatestRecord,
    getGoalForMetric,
  };
};
