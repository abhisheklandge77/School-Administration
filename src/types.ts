export interface SchoolDetails {
  schools: School[];
}

export interface School {
  classes: Class[];
  location: string;
  schoolName: string;
}

export interface Class {
  name: string;
  students: Student[];
  teacher: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  age: number;
}

export interface CardDetails {
  categoryType: string;
  name?: string;
  location?: string;
  classCount?: number;
  schoolName?: string;
  className?: string;
  teacher?: string;
  age?: number;
}

export interface GlobaSearchDetails {
  categoryType: string;
  category: string;
  heirarchy: string;
}

export interface AdvanceSearchDetails {
  selectedSchool: MappedSchool | null;
  selectedClass: MappedClass | null;
  selectedStudent: Student | null;
}

export interface MappedSchool {
  schoolName?: string;
  location?: string;
}

export interface MappedClass {
  className?: string;
  teacher?: string;
}

export interface FlattenData {
  [key: string]: string | number;
}
