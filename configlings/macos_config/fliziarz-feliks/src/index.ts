import { activateSpacesMoves } from './spaces'
import { HYPER_KEY } from './special-keys'

const gap = 8
const move = ( direction : Phoenix.Direction ) => {
  const frame = Screen.main().visibleFrame()
  const maxHeight = frame.height
  const maxWidth = frame.width

  console.log( { maxWidth, maxHeight } )

  const active = Window.focused() ?? Screen.main().windows().filter(( w ) => w.isVisible())[0]
  console.log( `moving ${direction} ${active.title}` )
  const neighbour = active.neighbors( direction )[0]
  if ( neighbour ) {
    const activePos = { ...neighbour.topLeft() }
    const activeSize = { ...neighbour.size() }
    console.log( { activeSize, activePos } )
    active.setTopLeft( neighbour.topLeft() )
    active.setSize( neighbour.size() )

    neighbour.setTopLeft( activePos )
    neighbour.setSize( activeSize )
  }
  else {
    if ( direction === 'east' ) {
      active.setTopLeft( { x: ((maxWidth - 2 * gap) / 2) + gap, y: gap } )
      active?.setSize( { width: (maxWidth / 2) - 2 * gap, height: (maxHeight) - (2 * gap) } )
    }
    if ( direction === 'west' ) {
      active.setTopLeft( { x: gap, y: gap } )
      active?.setSize( { width: (maxWidth / 2) - 2 * gap, height: (maxHeight) - (2 * gap) } )
    }
    if ( direction === 'south' ) {
      active.setTopLeft( { x: gap, y: ((maxHeight - 2 * gap) / 2) + gap } )
      active?.setSize( { width: maxWidth - 2 * gap, height: (maxHeight / 2) - (2 * gap) } )
    }
    if ( direction === 'north' ) {
      active.setTopLeft( { x: gap, y: gap } )
      active?.setSize( { width: maxWidth - 2 * gap, height: (maxHeight / 2) - (2 * gap) } )
    }
  }
}

// Key.on( 'd', HYPER_KEY.keys, () => {
//   move( 'east' )
// } )
// Key.on( 'w', HYPER_KEY.keys, () => {
//   move( 'north' )
// } )
// Key.on( 'a', HYPER_KEY.keys, () => {
//   move( 'west' )
// } )
// Key.on( 's', HYPER_KEY.keys, () => {
//   move( 'south' )
// } )
activateSpacesMoves()
