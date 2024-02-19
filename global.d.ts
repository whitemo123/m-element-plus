// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MRender: typeof import('m-element-plus')['MRender']
    MTable: typeof import('m-element-plus')['MTable']
    MCrud: typeof import('m-element-plus')['MCrud']
  }
}

export {}
