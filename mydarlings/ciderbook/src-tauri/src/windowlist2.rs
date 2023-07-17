extern crate core_foundation;
extern crate core_graphics;

use std::collections::HashMap;
use core_foundation::array::{CFArray, CFArrayRef};
use core_foundation::base::{CFType, TCFType};
use core_foundation::dictionary::{CFDictionary, CFDictionaryRef};
use core_foundation::string::{CFString, CFStringRef, __CFString};
use core_graphics::display::CGDisplay;
use core_graphics::window::CGWindowListCopyWindowInfo;
use core_graphics::window::kCGWindowListOptionIncludingWindow;

use core_graphics::window::kCGWindowName;

fn get_attr(item:&CFDictionary<CFType, CFType>, attr:CFType)->Option<String>{
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

pub fn get_window_list2() {
  let display_id = unsafe { CGDisplay::main().id };
    let window_list_dict = unsafe { CGWindowListCopyWindowInfo(kCGWindowListOptionIncludingWindow, display_id) };
    let window_list: CFArray<CFDictionary<CFType, CFType>> = unsafe {
        let arr_ref = std::mem::transmute(window_list_dict);
        CFArray::<CFDictionary<CFType, CFType>>::wrap_under_get_rule(arr_ref)
    };

    let mut name_counts: HashMap<String, u32> = HashMap::new();

    for window_info in window_list.iter() {

        if let Some(window_name) = get_attr(&window_info, unsafe { std::mem::transmute(kCGWindowName) }) {
          println!("window_name: {}", window_name);
        }
        if let Some(window_is_on_screen) = get_attr(&window_info, unsafe { std::mem::transmute(kCGWindowIsOnscreen) }) {
          println!("window_is_on_screen: {}", window_is_on_screen);
        }
        //  *name_counts.entry(window_name).or_insert(0) += 1;
    }

    // for (window_name, count) in name_counts {
    //     println!("{}: {}", window_name, count);
    // }


    // for (name, count) in name_counts {
    //     println!("{}: {}", name, count);
    // }
}