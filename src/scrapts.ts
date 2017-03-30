// this.socket.emit('newRider', this.rider, (err) => {
//   if ( err ) {
//     alert(err);
//   } else {
//     console.log('newRider. No error!');
//   }
// });
//
// this.socket.on('updateRiders', (riders) => {
//   this.riders = riders;
//
//   for ( let i = 0; i < this.riders.length; i++ ) {
//     if ( this.riders[ i ] ) {
//
//       let marker = new google.maps.Marker(this.riders[ i ]);
//       marker.setMap(this.myMap);
//       marker.setAnimation(google.maps.Animation.DROP);
//
//     }
//
//   }
// });