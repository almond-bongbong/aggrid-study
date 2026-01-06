export interface ListItem {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  salary: number;
  joinDate: string;
  performanceRating: number;
}

export type List = ListItem[];
