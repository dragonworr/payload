export type LoadingOverlayTypes = 'fullscreen' | 'withoutNav'

type ToggleLoadingOverlayOptions = {
  type?: LoadingOverlayTypes
  key: string
  isLoading?: boolean
}
export type ToggleLoadingOverlay = (options: ToggleLoadingOverlayOptions) => void

type Add = {
  type: 'add'
  payload: {
    type: LoadingOverlayTypes
    key: string
    loadingText?: string
  }
}
type Remove = {
  type: 'remove'
  payload: {
    key: string
    type: LoadingOverlayTypes
    loadingText?: never
  }
}
export type Action = Add | Remove
export type State = {
  isLoading: boolean
  overlayType: null | string
  loaders: {
    type: LoadingOverlayTypes
    key: string
  }[]
}
export type ReducerState = {
  isLoading: boolean
  overlayType: null | LoadingOverlayTypes
  loaders: {
    type: LoadingOverlayTypes
    key: string
  }[]
}

export type LoadingOverlayContext = {
  toggleLoadingOverlay: ToggleLoadingOverlay
  setLoadingOverlayText?: (text: string) => void
  isOnScreen: boolean
}
