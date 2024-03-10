// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MRender: typeof import('m-element-plus')['MRender']
    MQrcode: typeof import('m-element-plus')['MQrcode']
    MDialog: typeof import('m-element-plus')['MDialog']
    MPicture: typeof import('m-element-plus')['MPicture']
    MTable: typeof import('m-element-plus')['MTable']
    MCrud: typeof import('m-element-plus')['MCrud']
    MPagination: typeof import('m-element-plus')['MPagination']
  }
}

export {}
