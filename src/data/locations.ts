export interface SpringfieldLocation {
  id: string;
  name: string;
  type?: string;
  address?: string;
  owner?: string;
  principal?: string;
  pastor?: string;
  chief?: string;
  show?: string;
}

// Curated list of well-known Springfield locations
export const SPRINGFIELD_LOCATIONS: SpringfieldLocation[] = [
  { id: 'kwik-e-mart', name: 'Kwik-E-Mart', type: 'Store', address: 'Springfield', owner: 'Apu Nahasapeemapetilon' },
  { id: 'moes-tavern', name: "Moe's Tavern", type: 'Bar', address: 'Walnut Street, Springfield', owner: 'Moe Szyslak' },
  { id: 'springfield-elementary', name: 'Springfield Elementary School', type: 'School', principal: 'Seymour Skinner' },
  { id: 'nuclear-plant', name: 'Springfield Nuclear Power Plant', type: 'Power Plant', owner: 'Mr. Burns' },
  { id: 'simpson-house', name: 'Simpson Family House', type: 'Residence', address: '742 Evergreen Terrace' },
  { id: 'church', name: 'The First Church of Springfield', type: 'Church', pastor: 'Reverend Lovejoy' },
  { id: 'androids-dungeon', name: "The Android's Dungeon & Baseball Card Shop", type: 'Store', owner: 'Comic Book Guy' },
  { id: 'krustylu-studios', name: 'Krustylu Studios', type: 'TV Studio', show: 'Krusty the Clown' },
  { id: 'springfield-mall', name: 'Springfield Mall', type: 'Mall' },
  { id: 'police-station', name: 'Springfield Police Station', type: 'Police Station', chief: 'Chief Wiggum' },
  { id: 'springfield-gorge', name: 'Springfield Gorge', type: 'Landmark' },
  { id: 'noiseland-arcade', name: 'Noiseland Arcade', type: 'Arcade' },
  { id: 'duff-brewery', name: 'Duff Brewery', type: 'Brewery' },
  { id: 'springfield-town-hall', name: 'Springfield Town Hall', type: 'Government' },
  { id: 'springfield-general-hospital', name: 'Springfield General Hospital', type: 'Hospital' },
  { id: 'springfield-monorail', name: 'Springfield Monorail Station', type: 'Transit' },
  { id: 'springfield-penitentiary', name: 'Springfield Penitentiary', type: 'Prison' },
  { id: 'springfield-zoo', name: 'Springfield Zoo', type: 'Zoo' },
  { id: 'itchy-and-scratchy-studios', name: 'Itchy & Scratchy Studios', type: 'TV Studio' },
  { id: 'springfield-library', name: 'Springfield Public Library', type: 'Library' },
  { id: 'springfield-museum', name: 'Springfield Museum of Natural History', type: 'Museum' },
  { id: 'springfield-park', name: 'Springfield Park', type: 'Park' },
  { id: 'lard-lad-donuts', name: 'Lard Lad Donuts', type: 'Restaurant' },
  { id: 'rusty-barnacle', name: 'The Rusty Barnacle', type: 'Restaurant' },
  { id: 'pringles', name: 'Springfield Gorge Hospital Helipad', type: 'Landmark' }
];
