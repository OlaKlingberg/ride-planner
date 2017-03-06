export interface rider {
  name: string,
  position: {
    lat: number,
    lng: number
  },
  draggable: boolean,
  map?: any
}