// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MTable: typeof import('m-element-plus')['MTable']
  }
}

export {}
