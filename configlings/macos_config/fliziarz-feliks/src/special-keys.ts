export const MOD_KEYS : Record<string, { key : Phoenix.ModifierKey; label : string }> = {
  command: { key: 'cmd', label: '⌘' },
  alt: { key: 'alt', label: '⌥' },
  control: { key: 'ctrl', label: '⌃' },
  // fn:{
  //   key: 'fn' ,
  //   label: 'fn',
  // },
  shift: { key: 'shift', label: '⇧' },
} as const

export const HYPER_KEY = {
  keys: [ MOD_KEYS.control.key, MOD_KEYS.alt.key, MOD_KEYS.command.key ],
  label: `${MOD_KEYS.control.label} ${MOD_KEYS.alt.label} ${MOD_KEYS.command.label}` as const,
}
export const SHIFT_HYPER_KEY = {
  keys: [ 'shift' as Phoenix.ModifierKey, ...HYPER_KEY.keys ],
  Loader: `${MOD_KEYS.shift} ${HYPER_KEY.label}` as const,
}
// export const FN_HEYPER_KEY = {
//   keys: [ 'fn', ...HYPER_KEY.keys ],
//   Loader: `${MOD_KEYS.fn} ${HYPER_KEY}` as const,
// } as const
