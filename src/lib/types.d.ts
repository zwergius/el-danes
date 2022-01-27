export interface Experience {
  company: string
  contact: string
  from: string
  jobTitle: string
  link: string
  projects: Project[]
}

export interface Project {
  devices: string[]
  description: string
  iconName: string
  id: string
  name: string
  stack: string
  type: string
  visible: boolean
  url: string
}
