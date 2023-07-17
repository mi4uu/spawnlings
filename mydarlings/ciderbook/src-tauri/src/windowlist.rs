extern crate core_foundation_sys;
extern crate core_foundation;
extern crate core_graphics;
use serde::{Serialize, Deserialize};
use core_foundation::array::CFArray;
use core_foundation::base::{CFType, TCFType};
use core_foundation::dictionary::CFDictionary;
use core_foundation::string::{CFString, CFStringRef};
use core_graphics::display::CGDisplay;
use core_graphics::window::CGWindowListCopyWindowInfo;
use core_graphics::window::kCGWindowListOptionIncludingWindow;

use core_graphics::window as CGW;


#[derive(Serialize, Deserialize)]
struct WindowInfo {
    WindowNumber: Option<String>,
    WindowStoreType: Option<String>,
    WindowLayer: Option<String>,
    WindowBounds: Option<String>,
    WindowSharingState: Option<String>,
    WindowAlpha: Option<String>,
    WindowOwnerPID: Option<String>,
    WindowMemoryUsage: Option<String>,
    WindowWorkspace: Option<String>,
    WindowOwnerName: Option<String>,
    WindowName: Option<String>,
    WindowIsOnscreen: Option<String>,
    WindowBackingLocationVideoMemory: Option<String>,
}



fn get_attr(item:&CFDictionary<CFType, CFType>, attr:*const core_foundation_sys::string::__CFString)->Option<String>{
  let window_name_key: CFType = unsafe { std::mem::transmute(attr) };
  if let Some(window_name_raw) = item.find(&window_name_key) {
    // Convert the obtained raw CFType back to a CFString
    let window_name_cfstrref: CFStringRef = unsafe { std::mem::transmute(window_name_raw ) };

    let window_name_cfstring = unsafe { CFString::wrap_under_get_rule(window_name_cfstrref) };
    let window_name = window_name_cfstring.to_string();
    return Some(window_name.clone());
  }
  return None
}

pub fn get_window_list() {
  let display_id =  CGDisplay::main().id ;
    let window_list_dict = unsafe { CGWindowListCopyWindowInfo(kCGWindowListOptionIncludingWindow, display_id) };
    let window_list: CFArray<CFDictionary<CFType, CFType>> = unsafe {
        let arr_ref = std::mem::transmute(window_list_dict);
        CFArray::<CFDictionary<CFType, CFType>>::wrap_under_get_rule(arr_ref)
    };
    for window_info in window_list.iter() {

      let window = unsafe { WindowInfo {
        WindowNumber: get_attr(&window_info, CGW::kCGWindowNumber),
        WindowStoreType: get_attr(&window_info, CGW::kCGWindowStoreType),
        WindowLayer: get_attr(&window_info, CGW::kCGWindowLayer),
        WindowBounds: get_attr(&window_info, CGW::kCGWindowBounds),
        WindowSharingState: get_attr(&window_info, CGW::kCGWindowSharingState),
        WindowAlpha: get_attr(&window_info, CGW::kCGWindowAlpha),
        WindowOwnerPID: get_attr(&window_info, CGW::kCGWindowOwnerPID),
        WindowMemoryUsage: get_attr(&window_info, CGW::kCGWindowMemoryUsage),
        WindowWorkspace: get_attr(&window_info, CGW::kCGWindowWorkspace),
        WindowOwnerName: get_attr(&window_info, CGW::kCGWindowOwnerName),
        WindowName: get_attr(&window_info, CGW::kCGWindowName),
        WindowIsOnscreen: get_attr(&window_info, CGW::kCGWindowIsOnscreen),
        WindowBackingLocationVideoMemory: get_attr(&window_info, CGW::kCGWindowBackingLocationVideoMemory),
    } };


    }


}