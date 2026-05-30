export type UserRole = "client" | "specialist" | "admin"
export type AnalysisRunType = "self_analysis" | "expert_analysis" | "bach" | "dao_usin" | "follow_up"
export type AnalysisRunStatus = "draft" | "submitted" | "analyzed" | "archived"

export type CabinetUser = {
  id: string
  provider: string
  provider_user_id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type ClientProfile = {
  id: string
  user_id: string
  display_name: string
  birth_date: string | null
  focus_area: string | null
  created_at: string
  updated_at: string
}

export type AnalysisRun = {
  id: string
  user_id: string
  profile_id: string
  type: AnalysisRunType
  status: AnalysisRunStatus
  title: string
  summary: string
  dao_level: number
  primary_element: string
  bottleneck: string
  created_at: string
  updated_at: string
}

export type AnalysisAnswer = {
  id: string
  analysis_run_id: string
  payload_json: Record<string, unknown>
  created_at: string
}

export type Report = {
  id: string
  analysis_run_id: string
  user_id: string
  title: string
  report_json: Record<string, unknown>
  report_markdown: string
  pdf_url: string | null
  created_at: string
  updated_at: string
}

export type Recommendation = {
  id: string
  report_id: string
  user_id: string
  items_json: Array<Record<string, unknown>>
  repeat_check_after: string
  created_at: string
}

export type CabinetSnapshot = {
  user: CabinetUser
  profile: ClientProfile
  runs: AnalysisRun[]
  latestRun: AnalysisRun | null
  latestReport: Report | null
  recommendations: Recommendation[]
}

export type AuthContext = {
  hasOAuth: boolean
  isAuthenticated: boolean
  userId: string | null
  email: string | null
}
