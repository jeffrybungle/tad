export const TYPE_STYLES = {
  site:     { accent: '#eab308', panel: '#0d1117' }, // amber
  text:     { accent: '#14b8a6', panel: '#0b1615' }, // teal
  artifact: { accent: '#f97316', panel: '#171008' }, // orange
  region:   { accent: '#60a5fa', panel: '#0b1220' }, // blue (group)
  group:    { accent: '#60a5fa', panel: '#0b1220' },
  default:  { accent: '#22d3ee', panel: '#0d1117' }  // cyan
};

export function styleForType(type) {
  return TYPE_STYLES[type] || TYPE_STYLES.default;
}
