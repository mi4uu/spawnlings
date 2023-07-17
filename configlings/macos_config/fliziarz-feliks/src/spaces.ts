import { HYPER_KEY, SHIFT_HYPER_KEY } from './special-keys'

export const COLS = 4
export const ROWS = COLS

const getSpace = ( active : number, x : 0 | 1 | -1, y : 0 | 1 | -1 ) => {
  const activeRow = Math.floor( active / COLS )
  const activeCol = Math.floor( active % COLS )
  let newRow = activeRow + y
  let newCol = activeCol + x
  if ( newRow < 0 ) {
    newRow = ROWS - 1
  }
  if ( newRow >= ROWS ) {
    newRow = 0
  }
  if ( newCol < 0 ) {
    newCol = COLS - 1
  }
  if ( newCol >= COLS ) {
    newCol = 0
  }
  return newRow * COLS + newCol
}
const moveToSpace = ( x : 0 | 1 | -1, y : 0 | 1 | -1, move : boolean ) => {
  const window = Window.focused()

  const space = Space.active()

  if ( (move && !window) || !space ) {
    return
  }
  const spaces = Space.all()
  const spaceIndex = spaces.map(( s ) => s.hash()).indexOf( space.hash() )

  const newSpace = getSpace( spaceIndex, x, y )
  const screenFrame = Screen.main().flippedVisibleFrame()

  const spacesDisplay = new Array( COLS )
    .fill( ' ' )
    .map( ( _, i ) => {
      return new Array( ROWS )
        .fill( ' ' )
        .map( ( __, j ) => {
          return (i * COLS + j) === newSpace ? '🟨' : `⬜️`
        } )
        .join( '' )
    } )
    .join( '\n' )

  console.log( `${spaceIndex}  --->  ${newSpace}` )
  //  space.removeWindows( [ window ] )
  console.log( 'WINDOWS:', spaces[newSpace].windows() )
  const modal = Modal.build( {
    duration: 0.5,
    weight: 48,
    appearance: 'dark',

    //  icon: App.get('Phoenix').icon(),
    text: spacesDisplay,
  } )
  modal.origin = {
    x: screenFrame.width / 2 - modal.frame().width / 2,
    y: screenFrame.height / 2 - modal.frame().height / 2,
  }
  console.log( `
  ${spacesDisplay}
  ` )
  if ( move && window ) {
    spaces[newSpace].moveWindows( [ window ] )
    window.focus()
  }
  else {
    //    spaces[newSpace].moveWindows( [ modal ] )

    //  modal.show()

    spaces[newSpace].windows()[0].focus()
  }

  setTimeout( () => {
    modal.show()
  }, 300 )
}
export const activateSpacesMoves = () => {
  Key.on( 'left', SHIFT_HYPER_KEY.keys, () => moveToSpace( -1, 0, true ) )
  Key.on( 'right', SHIFT_HYPER_KEY.keys, () => moveToSpace( 1, 0, true ) )
  Key.on( 'up', SHIFT_HYPER_KEY.keys, () => moveToSpace( 0, -1, true ) )
  Key.on( 'down', SHIFT_HYPER_KEY.keys, () => moveToSpace( 0, 1, true ) )

  Key.on( 'left', HYPER_KEY.keys, () => moveToSpace( -1, 0, false ) )
  Key.on( 'right', HYPER_KEY.keys, () => moveToSpace( 1, 0, false ) )
  Key.on( 'up', HYPER_KEY.keys, () => moveToSpace( 0, -1, false ) )
  Key.on( 'down', HYPER_KEY.keys, () => moveToSpace( 0, 1, false ) )
}
