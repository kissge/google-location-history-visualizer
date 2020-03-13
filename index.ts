import * as fs from 'fs-extra';
import SemanticLocationHistory, { SemanticType } from './SemanticLocationHistory';

const DAYms = 24 * 60 * 60 * 1000;

const history: { name: string; type?: SemanticType; start: number; end: number }[] = [];
const locations = new Map<string, number>();

process.argv.slice(2).forEach(file => {
  const data = <SemanticLocationHistory>fs.readJSONSync(file);

  data.timelineObjects.forEach(obj => {
    if (obj.placeVisit) {
      history.push({
        name: obj.placeVisit.location.name,
        type: obj.placeVisit.location.semanticType,
        start: Number.parseInt(obj.placeVisit.duration.startTimestampMs),
        end: Number.parseInt(obj.placeVisit.duration.endTimestampMs),
      });
      locations.set(obj.placeVisit.location.name, (locations.get(obj.placeVisit.location.name) || 0) + 1);
    }
  });
});

history.sort((a, b) => a.start - b.start);

const popular = Array.from(locations)
  .sort(([_, a], [__, b]) => b - a)
  .slice(0, 10)
  .map(([name]) => name);

let date = new Date(history[0].start);
date.setHours(0, 0, 0, 0);

console.log(`<!DOCTYPE html><html><style>
body {
  font-size: 6px;
  line-height: 1;
}
section, div {
  margin: 0;
}
section {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: -1.8px;
}
.body > * {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}
.body > *:not(.location-empty) {
  background: #ddd;
}
.body > .location--1:not(:hover) { color: transparent; }
.body > .location-0 { background: hsl(0, 50%, 50%); }
.body > .location-1 { background: hsl(36, 50%, 50%); }
.body > .location-2 { background: hsl(72, 50%, 50%); }
.body > .location-3 { background: hsl(108, 50%, 50%); }
.body > .location-4 { background: hsl(144, 50%, 50%); }
.body > .location-5 { background: hsl(180, 50%, 50%); }
.body > .location-6 { background: hsl(216, 50%, 50%); }
.body > .location-7 { background: hsl(252, 50%, 50%); }
.body > .location-8 { background: hsl(288, 50%, 50%); }
.body > .location-9 { background: hsl(324, 50%, 50%); }
</style><body>`);
let output = '';

for (let start = date.getTime(); history.length > 0; start += DAYms) {
  let cursor = start;
  const end = start + DAYms;

  let day = '<section><div class="header">' + new Date(start).toLocaleDateString() + '</div><div class="body">';

  while (history.length > 0 && history[0].start < end) {
    const entry = history.shift();
    if (cursor < entry.start) {
      day += `<div class="location-empty" style="width: ${((entry.start - cursor) / DAYms) * 100}%"></div>`;
    }

    if (entry.end > end) {
      day += `<div class="location-${popular.indexOf(entry.name)}" style="width: ${((end - entry.start) / DAYms) *
        100}%">${entry.name}</div>`;
      history.unshift({ ...entry, start: end });
    } else {
      day += `<div class="location-${popular.indexOf(entry.name)}" style="width: ${((entry.end - entry.start) / DAYms) *
        100}%">${entry.name}</div>`;
      cursor = entry.end;
    }
  }

  day += '</div></section>';

  output += day;
}

console.log(output);
