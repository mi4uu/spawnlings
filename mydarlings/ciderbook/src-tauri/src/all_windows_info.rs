extern crate core_foundation;
extern crate core_graphics;

use core_foundation::array::CFArray;
use core_foundation::base::{CFType, TCFType};
use core_foundation::dictionary::CFDictionary;
use core_graphics::display::CGDisplay;
use core_graphics::window::{CGWindowListCopyWindowInfo, kCGWindowListOptionIncludingWindow};
pub fn get_all_windows_info() -> Vec<String> {
  let display_id = unsafe { CGDisplay::main().id };
  let arr_ref = unsafe { CGWindowListCopyWindowInfo(kCGWindowListOptionIncludingWindow, display_id) };

  let window_list: CFArray<CFDictionary<CFType>> = unsafe {
      let arr_ref = std::mem::transmute(arr_ref);
      CFArray::wrap_under_get_rule(arr_ref)
  };

  let mut windows_list:Vec<String> = Vec::new();
  for window_info in window_list.iter() {
    let window_data = format!("{:?}",  window_info);
    windows_list.push(window_data.clone());
  }
  return windows_list;
}