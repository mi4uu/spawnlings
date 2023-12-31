// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
use tauri::{SystemTray, SystemTrayMenu};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod all_windows_info;
use all_windows_info::get_all_windows_info;
use windowlist::get_window_list_without_desktop; // Import the function

mod windowlist;
// Import the function

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn get_windows_list() -> Result<String, String> {
    let windows_list = get_window_list_without_desktop();
    println!("windows_list: {:?}", windows_list);
    match serde_json::to_string(&windows_list) {
        Ok(s) => Ok(s),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    let tray_menu = SystemTrayMenu::new(); // insert the menu items here
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![get_windows_list])
        //   .setup(|_app| {
        //       #[cfg(target_os = "macos")]
        //       {
        //           let _ = set_shadow(_app.get_window("main").unwrap(), true);
        //           _app.get_window("main").unwrap().resizable(false)
        //           .transparent(false)
        //           .decorations(true)
        //         }
        //         Ok(())
        //     })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    //tauri::Builder::default()

    // .on_system_tray_event(|app, event| match event {
    //   SystemTrayEvent::LeftClick {
    //     position: _,
    //     size: _,
    //     ..
    //   } => {
    //     println!("system tray received a left click");
    //   }
    //   SystemTrayEvent::RightClick {
    //     position: _,
    //     size: _,
    //     ..
    //   } => {
    //     println!("system tray received a right click");
    //   }
    //   SystemTrayEvent::DoubleClick {
    //     position: _,
    //     size: _,
    //     ..
    //   } => {
    //     println!("system tray received a double click");
    //   }
    //   SystemTrayEvent::MenuItemClick { id, .. } => {
    //     match id.as_str() {
    //       "quit" => {
    //         std::process::exit(0);
    //       }
    //       "hide" => {
    //         let window = app.get_window("main").unwrap();
    //         window.hide().unwrap();
    //       }
    //       _ => {}
    //     }
    //   }
    //   _ => {}
    // })
    // .invoke_handler(tauri::generate_handler![greet])
    // .setup(|app| {
    //     #[cfg(target_os = "macOS")]
    //     {
    //         let _ = set_shadow(app.get_window("main").unwrap(), true);
    //     }
    //     Ok(())
    // })
    // .resizable(false)
    // .transparent(true)
    // .decorations(false)
    // .run(tauri::generate_context!())
    // .expect("error while running tauri application");
    // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    // let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    // let tray_menu = SystemTrayMenu::new()
    //     .add_item(quit)
    //     .add_native_item(SystemTrayMenuItem::Separator)
    //     .add_item(hide);
}
