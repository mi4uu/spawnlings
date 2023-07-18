extern crate core_foundation;
extern crate core_foundation_sys;
extern crate core_graphics;
use core_foundation::array::CFArray;
use core_foundation::base::{CFType, TCFType};
use core_foundation::dictionary::CFDictionary;
use core_foundation::number::CFNumber;
use core_foundation::string::{CFString, CFStringRef};
use core_graphics::display::CGDisplay;
use core_graphics::window::{kCGWindowListOptionIncludingWindow, kCGWindowListOptionExcludeDesktopElements};
use core_graphics::window::CGWindowListCopyWindowInfo;
use serde::{Deserialize, Serialize};
use core_foundation::boolean::CFBoolean;
use core_graphics::window as CGW;
use std::error::Error;
use std::any::Any;

fn getStr(value: Box<dyn Any>) -> Option<String> {
    if let Ok(string) = value.downcast::<String>() {
        return Some( string.to_string());
    }
    None
}
fn getBool(value: Box<dyn Any>) -> Option<String> {
  if let Ok(vresolved) = value.downcast::<bool>() {
      return Some(format!("{:?}", vresolved));
  }
  None
}
fn getNum(value: Box<dyn Any>) -> Option<String> {
  if let Ok(vresolved) = value.downcast::<i32>() {
      return Some(format!("{:?}", vresolved));
  }

  None
}
fn getSize(value: Box<dyn Any>) -> Option<String> {
  if let Ok(vresolved) = value.downcast::<usize>() {
      return Some(format!("{:?}", vresolved));
  }

  None
}
#[derive(Serialize, Deserialize, Debug)]
pub struct WindowInfo {
    window_number: Option<String>,
    window_store_type: Option<String>,
    window_layer: Option<String>,
    window_bounds: Option<String>,
    window_sharing_state: Option<String>,
    window_alpha: Option<String>,
    window_owner_pid: Option<String>,
    window_memory_usage: Option<String>,
    window_workspace: Option<String>,
    window_owner_name: Option<String>,
    window_name: Option<String>,
    window_is_onscreen: Option<String>,
    window_backing_location_video_memory: Option<String>,
}




fn get_attr(
  item: &CFDictionary<CFType, CFType>,
  attr: *const core_foundation_sys::string::__CFString,
) -> Option<String> {
  let result_key: CFType = unsafe { std::mem::transmute(attr) };
  result_key.show();
println!("window_name_key: {:?}", result_key.type_of());

  if let Some(result_raw) = item.find(&result_key) {
    let ascfType = result_raw.as_CFType();
    let ascBox=Box::new(ascfType);


    if let Some(s1) = getStr(ascBox.clone()) {
      return Some(s1.to_string())
    };
    if let Some(s2) = getBool(ascBox.clone()) {
      return Some(s2.to_string())
    };
    if let Some(s3) = getNum(ascBox.clone()) {
      return Some(s3.to_string())
    };




    if let Some(s1) = getSize(ascBox.clone()) {
      return Some(s1.to_string())
    };



      if let Some(stringResult) =  result_raw.as_CFType().downcast::<CFString>() {
        return Some(stringResult.to_string())
      };


      if let Some(boolResult) =  result_raw.as_CFType().downcast::<CFBoolean>() {
        return Some(format!("{:?}", boolResult))
      };
        if let Some(intResult) =  result_raw.as_CFType().downcast::<CFNumber>() {
          return Some(format!("{:?}", intResult))

      };

    // if(ascfType.instance_of::<CFBoolean>()) {

    // }
    // if(ascfType.instance_of::<CFString>()) {
    //   let strResult =unsafe { std::mem::transmute<,CFString>(ascfType).to_string() };
    //   return Some(strResult)
    // }
    return None
    //   let result_cfstrref = unsafe { std::mem::transmute::<_, CFStringRef>(result_raw.as_CFType()) };
    //   let result_cfstring = unsafe { CFString::wrap_under_get_rule(result_cfstrref) };

    //   let result = result_cfstring.to_string();
    // Some(result)
  } else {
      None
  }
}

pub fn get_window_list_without_desktop() ->Vec<WindowInfo>{
    let display_id = CGDisplay::main().id;
    let window_list_dict =
        unsafe { CGWindowListCopyWindowInfo(kCGWindowListOptionExcludeDesktopElements, display_id) };
    let window_list: CFArray<CFDictionary<CFType, CFType>> = unsafe {
        CFArray::<CFDictionary<CFType, CFType>>::wrap_under_get_rule(window_list_dict)
    };
    let mut window_info_list: Vec<WindowInfo> = Vec::new();
    for window_info in window_list.iter() {




        let _window = unsafe {
            WindowInfo {
                window_number: get_attr(&window_info, CGW::kCGWindowNumber),
                window_store_type: get_attr(&window_info, CGW::kCGWindowStoreType),
                window_layer: get_attr(&window_info, CGW::kCGWindowLayer),
                window_bounds: get_attr(&window_info, CGW::kCGWindowBounds),
                window_sharing_state: get_attr(&window_info, CGW::kCGWindowSharingState),
                window_alpha: get_attr(&window_info, CGW::kCGWindowAlpha),
                window_owner_pid: get_attr(&window_info, CGW::kCGWindowOwnerPID),
                window_memory_usage: get_attr(&window_info, CGW::kCGWindowMemoryUsage),
                window_workspace: get_attr(&window_info, CGW::kCGWindowWorkspace),
                window_owner_name: get_attr(&window_info, CGW::kCGWindowOwnerName),
                window_name: get_attr(&window_info, CGW::kCGWindowName),
                window_is_onscreen: get_attr(&window_info, CGW::kCGWindowIsOnscreen),
                window_backing_location_video_memory: get_attr(
                    &window_info,
                    CGW::kCGWindowBackingLocationVideoMemory,
                ),
            }
        };
        window_info_list.push(_window);
    }
    return window_info_list;
}
