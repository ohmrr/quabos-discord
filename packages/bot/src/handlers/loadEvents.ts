import { readdirSync } from 'fs';
import path from 'path';


export default function loadEvents() {
  const eventDir = path.join('..', 'events');
  const events = readdirSync(eventDir);

  for (const event of events) {
    
  }
}
