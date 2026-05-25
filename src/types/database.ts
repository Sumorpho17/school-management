export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          email: string | null;
          phone: string | null;
          address: string | null;
          admission_number: string;
          enrollment_date: string;
          status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          admission_number: string;
          enrollment_date?: string;
          status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          admission_number?: string;
          enrollment_date?: string;
          status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_student_id_fkey';
            columns: ['id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['student_id'];
          },
        ];
      };

      teachers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other';
          address: string | null;
          employee_id: string;
          department_id: string | null;
          subject_specialization: string | null;
          qualification: string | null;
          hire_date: string;
          status: 'active' | 'inactive' | 'on_leave' | 'terminated';
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender: 'male' | 'female' | 'other';
          address?: string | null;
          employee_id: string;
          department_id?: string | null;
          subject_specialization?: string | null;
          qualification?: string | null;
          hire_date?: string;
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated';
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other';
          address?: string | null;
          employee_id?: string;
          department_id?: string | null;
          subject_specialization?: string | null;
          qualification?: string | null;
          hire_date?: string;
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated';
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teachers_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };

      classes: {
        Row: {
          id: string;
          name: string;
          grade_level: string;
          section: string | null;
          academic_year: string;
          class_teacher_id: string | null;
          capacity: number | null;
          room_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          grade_level: string;
          section?: string | null;
          academic_year: string;
          class_teacher_id?: string | null;
          capacity?: number | null;
          room_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          grade_level?: string;
          section?: string | null;
          academic_year?: string;
          class_teacher_id?: string | null;
          capacity?: number | null;
          room_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_class_teacher_id_fkey';
            columns: ['class_teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };

      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          credit_hours: number | null;
          department_id: string | null;
          is_elective: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          credit_hours?: number | null;
          department_id?: string | null;
          is_elective?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          credit_hours?: number | null;
          department_id?: string | null;
          is_elective?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subjects_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };

      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          head_teacher_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          head_teacher_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          head_teacher_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'departments_head_teacher_id_fkey';
            columns: ['head_teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };

      enrollments: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          academic_year: string;
          enrollment_date: string;
          status: 'active' | 'dropped' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          academic_year: string;
          enrollment_date?: string;
          status?: 'active' | 'dropped' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          academic_year?: string;
          enrollment_date?: string;
          status?: 'active' | 'dropped' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
        ];
      };

      attendance: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          remarks: string | null;
          recorded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          remarks?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late' | 'excused';
          remarks?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attendance_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_recorded_by_fkey';
            columns: ['recorded_by'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };

      grades: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          class_id: string;
          score: number;
          grade: string | null;
          term: 'first' | 'second' | 'third';
          academic_year: string;
          exam_type: 'midterm' | 'final' | 'assignment' | 'quiz' | 'project';
          remarks: string | null;
          graded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          class_id: string;
          score: number;
          grade?: string | null;
          term: 'first' | 'second' | 'third';
          academic_year: string;
          exam_type: 'midterm' | 'final' | 'assignment' | 'quiz' | 'project';
          remarks?: string | null;
          graded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject_id?: string;
          class_id?: string;
          score?: number;
          grade?: string | null;
          term?: 'first' | 'second' | 'third';
          academic_year?: string;
          exam_type?: 'midterm' | 'final' | 'assignment' | 'quiz' | 'project';
          remarks?: string | null;
          graded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'grades_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'grades_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'grades_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'grades_graded_by_fkey';
            columns: ['graded_by'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };

      parents: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          address: string | null;
          occupation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          address?: string | null;
          occupation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string;
          address?: string | null;
          occupation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      student_parents: {
        Row: {
          id: string;
          student_id: string;
          parent_id: string;
          relationship: 'father' | 'mother' | 'guardian' | 'other';
          is_primary_contact: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          parent_id: string;
          relationship: 'father' | 'mother' | 'guardian' | 'other';
          is_primary_contact?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          parent_id?: string;
          relationship?: 'father' | 'mother' | 'guardian' | 'other';
          is_primary_contact?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_parents_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_parents_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'parents';
            referencedColumns: ['id'];
          },
        ];
      };

      timetable: {
        Row: {
          id: string;
          class_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
          start_time: string;
          end_time: string;
          room_number: string | null;
          academic_year: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
          start_time: string;
          end_time: string;
          room_number?: string | null;
          academic_year: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          subject_id?: string;
          teacher_id?: string;
          day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
          start_time?: string;
          end_time?: string;
          room_number?: string | null;
          academic_year?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'timetable_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'timetable_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'timetable_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };

      fees: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          fee_type: 'tuition' | 'registration' | 'exam' | 'library' | 'transport' | 'uniform' | 'other';
          description: string | null;
          due_date: string;
          paid_date: string | null;
          status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
          payment_method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | null;
          receipt_number: string | null;
          academic_year: string;
          term: 'first' | 'second' | 'third';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          fee_type: 'tuition' | 'registration' | 'exam' | 'library' | 'transport' | 'uniform' | 'other';
          description?: string | null;
          due_date: string;
          paid_date?: string | null;
          status?: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
          payment_method?: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | null;
          receipt_number?: string | null;
          academic_year: string;
          term: 'first' | 'second' | 'third';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          amount?: number;
          fee_type?: 'tuition' | 'registration' | 'exam' | 'library' | 'transport' | 'uniform' | 'other';
          description?: string | null;
          due_date?: string;
          paid_date?: string | null;
          status?: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
          payment_method?: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | null;
          receipt_number?: string | null;
          academic_year?: string;
          term?: 'first' | 'second' | 'third';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fees_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          subscription_plan: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          subscription_plan?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          subscription_plan?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      academic_terms: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_current?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'academic_terms_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          school_id: string | null;
          role: 'super_admin' | 'admin' | 'teacher' | 'parent';
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          school_id?: string | null;
          role?: 'super_admin' | 'admin' | 'teacher' | 'parent';
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string | null;
          role?: 'super_admin' | 'admin' | 'teacher' | 'parent';
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
    };

    Views: {};

    Functions: {};

    Enums: {
      user_role: 'super_admin' | 'admin' | 'teacher' | 'parent';
      student_status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
      teacher_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
      gender_type: 'male' | 'female' | 'other';
      attendance_status: 'present' | 'absent' | 'late' | 'excused';
      enrollment_status: 'active' | 'dropped' | 'completed';
      term_type: 'first' | 'second' | 'third';
      exam_type: 'midterm' | 'final' | 'assignment' | 'quiz' | 'project';
      fee_type: 'tuition' | 'registration' | 'exam' | 'library' | 'transport' | 'uniform' | 'other';
      fee_status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
      payment_method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money';
      day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
      parent_relationship: 'father' | 'mother' | 'guardian' | 'other';
    };

    CompositeTypes: {};
  };
};

// ----- Convenience type helpers -----

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
    PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
    PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
