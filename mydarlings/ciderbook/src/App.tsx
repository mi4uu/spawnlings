import { invoke } from '@tauri-apps/api/tauri'
import { useState } from 'react'
import './App.css'

function App() {
  const [ allWindows, setAllWindows ] = useState<string[]>()
  async function getWindowsList() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    try {
      const windowsRaw = await invoke( 'get_windows_list' )
      const windows = JSON.parse( windowsRaw as string )
      console.log( { windows } )
      setAllWindows( windows )
    }
    catch (error) {
      console.error( { error } )
    }
  }
  console.log( { allWindows } )

  return (
    <div className='container'>
      <button onClick={ getWindowsList }>
        Get Windows List
      </button>
      <div>
        <pre>{ JSON.stringify( allWindows ) }</pre>
      </div>
    </div>
  )
}

export default App
