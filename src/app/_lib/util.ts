function nameSort(a, b) {
  if ( a.lname < b.lname ) return -1; // Sort first on last name ...
  if ( a.lname > b.lname ) return 1;
  if ( a.fname < b.fname ) return -1; // If two users have the same last name, sort on first name.
  return 1;
}

export { nameSort }