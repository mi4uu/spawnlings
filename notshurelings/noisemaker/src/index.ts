// import { app, BrowserWindow } from 'electron';
import { menubar } from 'menubar'
// import { menubar } from 'electron'
import path from 'path'
const mb = menubar( {
  index: `file://${path.join( process.cwd(), 'assets', 'index.html' )}`,
  //  icon: path.join( process.cwd(), 'assets', 'icon.png' ),
  tooltip: 'mrrrr...',
} )
mb.on( 'ready', () => {
  console.log( path.join( process.cwd(), 'assets', 'icon.png' ) )
  console.log( 'Menubar app is ready!' )
} )
